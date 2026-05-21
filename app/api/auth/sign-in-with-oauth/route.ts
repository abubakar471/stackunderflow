import handleError from "@/lib/handlers/error";
import {ValidationError} from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import {SignInWithOAuthSchema} from "@/lib/validations";
import {APIErrorResponse} from "@/types/global";
import User from "@/database/user.model";
import mongoose from "mongoose";
import slugify from "slugify";
import Account from "@/database/account.model";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const {provider, providerAccountId, user} =  await request.json();

  await dbConnect();

  /*
  * mongoose session is a part of mongodb's
  * transaction feature. allowing multiple operations
  * to be executed at a single atomic unit. they
  * ensures either all operations were successfully
  * executed or applied otherwise if a single one
  * operation is failed then it wont even apply the
  * successful operations. we are doing this because
  * for example for the first time when then user
  * signs up, we will create first the Account
  * document when user signs up, then aUser document,
  * if Account document creation or user document
  * creation is failed then none
  * of these two will save we will discard
  * the operation.this session feature is
  * useful for maintaining data consistency on complex
  * operations like this multi-document update
  * */

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const validatedData = SignInWithOAuthSchema.safeParse({provider, providerAccountId, user});

    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }


    const {name, username, email, image} = user;

    const slugifiedUsername = slugify(username, {
      lower: true,
      strict: true,
      trim: true,
    });

    let existingUser = await User.findOne({email}).session(session);

    if(!existingUser){
      [existingUser] = await User.create(
        [{name, username : slugifiedUsername, email, image}],
        {session}
      )
    } else{
      const updatedData : {name?: string, image?: string} = {};

       if(existingUser.name !== name){
          updatedData.name = name
        }
        if(existingUser.image !== image){
          updatedData.image = image;
        }

      if(Object.keys(updatedData).length > 0){
        await User.updateOne(
          {_id : existingUser._id},
          {$set:updatedData}
        ).session(session);
      }
    }

    const existingAccount = await Account.findOne({userId : existingUser._id, provider, providerAccountId}).session(session);


    if(!existingAccount){
      await Account.create(
        [
          {
            userId : existingUser._id,
            name, 
            image, 
            provider,
            providerAccountId
          }
        ],
        {session}
      )
    }

    /* 
      so if the session transaction was successful then we will commit the transaction to save the changes in the database otherwise if any error was thrown we will abort the transaction to discard all the changes. this is like we go with all of them or none of them.
    */
    await session.commitTransaction();

    return NextResponse.json({success : true});
  } catch (error: unknown) {
    if (session.inTransaction()) {
      await session.abortTransaction().catch(() => {});
    }
    return handleError(error, "api") as APIErrorResponse;
  } finally {
    session.endSession();
  }
}
