import { model, models, Schema } from "mongoose"

/* 
    we are creating this interface IUser (interface user) so that we can properly handle types in the components in frontend where this user model will be used, so the frontend will know exactly what property the User model has
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