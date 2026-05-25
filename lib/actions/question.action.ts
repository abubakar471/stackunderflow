"use server";

import { ActionResponse, ErrorResponse } from "@/types/global";
import action from "../handlers/action";
import {
  AskQuestionSchema,
  EditQuestionSchema,
  GetQuestionSchema,
  PaginatedSearchParamsSchema,
} from "../validations";
import handleError from "../handlers/error";
import mongoose from "mongoose";
import Question, { IQuestionDoc } from "@/database/question.model";
import Tag, { ITagDoc } from "@/database/tag.model";
import TagQuestion from "@/database/tag-question.model";

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeTags = (tags: string[]) => {
  const normalizedTags: string[] = [];
  const seenTags = new Set<string>();

  for (const tag of tags) {
    const trimmedTag = tag.trim();
    const normalizedTag = trimmedTag.toLowerCase();

    if (!trimmedTag || seenTags.has(normalizedTag)) {
      continue;
    }

    seenTags.add(normalizedTag);
    normalizedTags.push(trimmedTag);
  }

  return normalizedTags;
};

const findOrCreateTag = async (
  tag: string,
  session: mongoose.ClientSession
) => {
  return Tag.findOneAndUpdate(
    { name: { $regex: new RegExp(`^${escapeRegExp(tag)}$`, "i") } },
    { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
    { upsert: true, new: true, session }
  );
};

export async function createQuestion(
  params: CreateQuestionParams
): Promise<ActionResponse<Question>> {
  const validationResult = await action({
    params,
    schema: AskQuestionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { title, content, tags } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;
  const normalizedTags = normalizeTags(tags);

  let session: mongoose.ClientSession | null = null;

  try {
    session = await mongoose.startSession();

    const transactionResult = await session.withTransaction(async () => {
      const transactionSession = session;

      if (!transactionSession) {
        throw new Error("Transaction session is unavailable");
      }

      const [question] = await Question.create(
        [
          {
            title,
            content,
            author: userId,
          },
        ],
        { session: transactionSession }
      );

      if (!question) {
        throw new Error("Failed to create question");
      }

      const tagIds: mongoose.Types.ObjectId[] = [];
      const tagQuestionsDocuments = [];

      for (const tag of normalizedTags) {
        const existingTag = await findOrCreateTag(tag, transactionSession);

        if (!existingTag) {
          throw new Error("Failed to create tag");
        }

        tagIds.push(existingTag._id);
        tagQuestionsDocuments.push({
          tag: existingTag._id,
          question: question._id,
        });
      }

      if (tagQuestionsDocuments.length > 0) {
        await TagQuestion.insertMany(tagQuestionsDocuments, {
          session: transactionSession,
        });
      }

      question.tags = tagIds;
      await question.save({ session: transactionSession });

      return { success: true, data: JSON.parse(JSON.stringify(question)) };
    });

    // withTransaction returns the value from the callback; return it from this action
    return transactionResult as ActionResponse<Question>;
  } catch (error) {
    return handleError(error) as ErrorResponse;
  } finally {
    await session?.endSession();
  }
}

export async function editQuestion(
  params: EditQuestionParams
): Promise<ActionResponse<IQuestionDoc>> {
  const validationResult = await action({
    params,
    schema: EditQuestionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { title, content, tags, questionId } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;
  const normalizedTags = normalizeTags(tags);

  let session: mongoose.ClientSession | null = null;

  try {
    session = await mongoose.startSession();
    const transactionResult = await session.withTransaction(async () => {
      const transactionSession = session;

      if (!transactionSession) {
        throw new Error("Transaction session is unavailable");
      }

      const question = await Question.findById(questionId).populate("tags");

      if (!question) {
        throw new Error("Question not found");
      }

      if (question.author.toString() !== userId) {
        throw new Error("Unauthorized");
      }

      if (question.title !== title || question.content !== content) {
        question.title = title;
        question.content = content;
        await question.save({ session: transactionSession });
      }

      const existingTags = question.tags as unknown as ITagDoc[];
      const existingTagNameSet = new Set(
        existingTags.map((tag) => tag.name.toLowerCase())
      );
      const incomingTagNameSet = new Set(
        normalizedTags.map((tag) => tag.toLowerCase())
      );

      const tagsToAdd = normalizedTags.filter(
        (tag) => !existingTagNameSet.has(tag.toLowerCase())
      );

      const tagsToRemove = existingTags.filter(
        (tag) => !incomingTagNameSet.has(tag.name.toLowerCase())
      );

      const newTagDocuments = [];
      const tagIdsToAdd: mongoose.Types.ObjectId[] = [];

      if (tagsToAdd.length > 0) {
        for (const tag of tagsToAdd) {
          const existingTag = await findOrCreateTag(tag, transactionSession);

          if (existingTag) {
            newTagDocuments.push({
              tag: existingTag._id,
              question: questionId,
            });
            tagIdsToAdd.push(existingTag._id);
          }
        }
      }

      if (tagsToRemove.length > 0) {
        const tagIdsToRemove = tagsToRemove.map((tag: ITagDoc) => tag._id);

        await Tag.updateMany(
          { _id: { $in: tagIdsToRemove } },
          { $inc: { questions: -1 } },
          { session: transactionSession }
        );
        await TagQuestion.deleteMany(
          { tag: { $in: tagIdsToRemove }, question: questionId },
          { session: transactionSession }
        );
      }

      if (newTagDocuments.length > 0) {
        await TagQuestion.insertMany(newTagDocuments, {
          session: transactionSession,
        });
      }

      const tagIdsToRemove = new Set(
        tagsToRemove.map((tag: ITagDoc) => tag._id.toString())
      );
      const remainingTagIds = existingTags
        .map((tag) => tag._id)
        .filter((tagId) => !tagIdsToRemove.has(tagId.toString()));

      question.tags = [...remainingTagIds, ...tagIdsToAdd];

      await question.save({ session: transactionSession });

      return { success: true, data: JSON.parse(JSON.stringify(question)) };
    });

    return transactionResult as ActionResponse<IQuestionDoc>;
  } catch (error) {
    return handleError(error) as ErrorResponse;
  } finally {
    await session?.endSession();
  }
}

export async function getQuestion(
  params: GetQuestionsParams
): Promise<ActionResponse<Question>> {
  const validationResult = await action({
    params,
    schema: GetQuestionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId } = validationResult.params!;

  try {
    const question = await Question.findById(questionId).populate("tags");

    if (!question) {
      throw new Error("Question not found");
    }

    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getQuestions(
  params: PaginationSearchParams
): Promise<ActionResponse<{ questions: Question[]; isNext: boolean }>> {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {
    page = 1,
    pageSize = 10,
    query,
    filter,
    sort,
  } = validationResult.params!;

  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);
  const filterQuery: Record<string, any> = {};

  if (filter === "recommended") {
    return { success: true, data: { questions: [], isNext: false } };
  }

  if (query) {
    filterQuery.$or = [
      { title: { $regex: query, $options: "i" } },
      { content: { $regex: query, $options: "i" } },
    ];
  }

  let sortCriteria = {};

  switch (filter) {
    case "newest":
      sortCriteria = { createdAt: -1 };
      break;
    case "unanswered":
      filterQuery.answers = 0;
      sortCriteria = { createdAt: -1 };
      break;
    case "popular":
      sortCriteria = { upvotes: -1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
  }

  try {
    const totalQuestions = await Question.countDocuments(filterQuery);

    const questions = await Question.find(filterQuery)
      .populate("tags", "name")
      .populate("author", "name image")
      .lean()
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    const isNext = totalQuestions > skip + questions.length;
    return {
      success: true,
      data: {
        questions: JSON.parse(JSON.stringify(questions)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
