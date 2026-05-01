import {Schema, model, models, Types} from "mongoose"

interface IVote {
    type : string, 
    voteType : string;
    id : Types.ObjectId;
    author : Types.ObjectId;
};

const VoteSchema = new Schema<IVote>({
    author : {
        type : Schema.Types.ObjectId, 
        ref : "User", 
        required : true
    },
    id : {
        type : Schema.Types.ObjectId, // on which model they are voting on like question or answer
        required : true
    },
    type : {
        type : String, 
        enum : ['question', 'answer'], 
        required : true
    },
    voteType : {
        type : String, 
        enum : ['upvote', 'downvote'], 
        required : true
    }
}, { timestamps : true});

const Vote = models?.Vote || model<IVote>("Vote", VoteSchema);

export default Vote