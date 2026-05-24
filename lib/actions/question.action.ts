"use server";

import { ActionResponse, ErrorResponse } from "@/types/global";
import action from "../handlers/action";
import { AskQuestionSchema } from "../validations";
import handleError from "../handlers/error";
import mongoose from "mongoose";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import TagQuestion from "@/database/tag-question.model";

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

  let session: mongoose.ClientSession | null = null;

  try {
    session = await mongoose.startSession();

    const transactionResult = await session.withTransaction(async () => {
      const [question] = await Question.create(
        [
          {
            title,
            content,
            author: userId,
          },
        ],
        { session }
      );

      if (!question) {
        throw new Error("Failed to create question");
      }

      const tagIds: mongoose.Types.ObjectId[] = [];
      const tagQuestionsDocuments = [];

      for (const tag of tags) {
        const existingTag = await Tag.findOneAndUpdate(
          { name: { $regex: new RegExp(`^${tag}$`, "i") } },
          { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
          { upsert: true, new: true, session }
        );

        tagIds.push(existingTag._id);
        tagQuestionsDocuments.push({
          tag: existingTag._id,
          question: question._id,
        });
      }

      await TagQuestion.insertMany(tagQuestionsDocuments, { session });
      await Question.findByIdAndUpdate(
        question._id,
        { $push: { tags: { $each: tagIds } } },
        { session }
      );

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
