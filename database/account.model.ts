import { model, models, Schema, Types } from "mongoose";

/* 
    we are creating this interface IAccount (interface account) so that we can properly handle types in the components in frontend where this account model will be used, so the frontend will know exactly what property the Account model has
*/
export interface IAccount{
    userId : Types.ObjectId;
    name : string;
    image?: string;
    password?: string;
    provider : string;
    providerAccountId : string;
}

const AccountSchema = new Schema<IAccount>({
    userId : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    name : {
        type : String,
        required : true
    },
    image : {
        type : String
    },
    password : {
        type : String
    },
    provider : {
        type : String,
        required : true
    },
    providerAccountId : {
        type : String,
        required : true
    }
})

const Account = models?.Account || model<IAccount>("Account", AccountSchema);

export default Account