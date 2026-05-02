import { model, models, Schema } from "mongoose"

/* 
    we are creating this interface IUser (interface user) so that we can properly handle types in the user model, so the model will know what exactly fields a user model should have, so this schema is only for backend and the zod UserSchema defined in the global.d.ts file is the schema for the frontend
*/
export interface IUser{
    name : string;
    username : string;
    email : string;
    bio?: string;
    image : string;
    location?: string;
    portfolio?: string;
    reputation?: number;
}

const UserSchema = new Schema<IUser>({
    name : {
        type : String,
        required : true
    }, 
    username : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unqiue : true
    },
    bio : {
        type : String
    },
    image : {
        type : String,
        required : true
    },
    location : {
        type : String
    },
    portfolio : {
        type : String
    },
    reputation : {
        type : Number, 
        default : 0
    }
},{
    timestamps : true
})

// models?.user checks if a User model is already created then use that, otherwise if User model doesn't exists create a new one
const User = models?.User || model<IUser>("User", UserSchema);

export default User