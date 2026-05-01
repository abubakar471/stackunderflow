import {Schema, model, models, Types} from "mongoose"

interface IInteraction {
    user : Types.ObjectId;
    action : string;
    actionId : Types.ObjectId;
    actionType : "question" | "answer";
};

const InteractionSchema = new Schema<IInteraction>({
    user : {
        type : Schema.Types.ObjectId,
        ref : "User", 
        required : true
    },
    action : {
        type : String, // upvote or downvote or viewing if they are viewing other profile
        required : true
    },
    actionId : {
        type : Schema.Types.ObjectId, // for question it will be the question id, for answers it will be answer id, or even a answer id, if they are viewing another users profile, its like facebook suggesting you reels that kind of you often see 
        required : true
    },
    actionType : {
        type : String,
        enum : ["question", "answers"], // for now we are only user behavior on what type of question or answers they engage on, later we will extend or we can extend to do so many more things
        required :  true,
    }
}, { timestamps : true});

const Interaction = models?.Interaction || model<IInteraction>("Interaction", InteractionSchema);

export default Interaction