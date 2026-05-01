import {Schema, model, models, Types} from "mongoose"

interface IQuestion {
    title : string;
    content : string;
    tags : Types.ObjectId[],
    views : number;
    upvotes : number;
    downvotes : number;
    answers : number;
    author : Types.ObjectId;
};

const QuestionSchema = new Schema<IQuestion>({
    title : {
        type : String,
        required : true
    },
    content : {
        type : String,
        required : true
    },
    tags : [{type : Schema.Types.ObjectId, ref : "Tag"}],
    views : {type : Number, default : 0},
    upvotes : {type : Number, default : 0},
    downvotes : {type : Number, default : 0},
    answers : {type : Number, default : 0}, // we only keeping the answers count, not directly the answers as references, for answer we will create another collection that will store answer and quessionId field in it. so, it will be like one t0 many situation. when one question will have many answer documents but one answer will only have one question
    author : {type : Schema.Types.ObjectId, ref : "User", required : true}
}, { timestamps : true});

const Question = models?.Question || model<IQuestion>("Question", QuestionSchema);

export default Question