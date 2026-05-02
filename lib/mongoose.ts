import mongoose, {Mongoose} from "mongoose"
import logger from "./logger";

const MONGODB_URI = process.env.MONGODB_URI as string

if(!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");    
}


interface MonggoseCache {
    conn : Mongoose | null;
    promise : Promise<Mongoose> | null;
}

declare global {
    var mongoose : MonggoseCache;
}

let cached = global.mongoose;

if(!cached){
    cached = global.mongoose = {conn : null, promise : null}
}

const dbConnect = async() :Promise<Mongoose>  => {
    if(cached.conn)  {
        logger.info("using existing mongoose connection");
        return cached.conn;
    } 

    if(!cached.promise){
        cached.promise = mongoose.connect(MONGODB_URI, {
            dbName : 'StackUnderflow'
        })
        .then((result) => {
            logger.info('connected to mongodb')
            return result;
        })
        .catch((err) => {
            logger.error("Error connecting to mongodb", err);
            throw err;
        })
    }

    cached.conn = await cached.promise;

    return cached.conn;
}

export default dbConnect;