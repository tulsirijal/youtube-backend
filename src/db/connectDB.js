import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async()=>{
    try {
        const connection = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log(`\n MONGODB connected successfully: ${connection.connection.host}`)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
} 

export default  connectDB