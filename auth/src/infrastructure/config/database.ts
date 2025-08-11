import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config()

const databaseConnection = async () => {
    try {
        const MONGO_URL = process.env.MONGO_URL;
        console.log(MONGO_URL)
        const connection = await mongoose.connect(
            `${MONGO_URL}/AUTH-SERVICE`,
        );
        console.log(`auth-service db is connected to ${connection}`);
    } catch (error) {
        console.log(error);
         
    }
}

export { databaseConnection };