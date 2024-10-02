import mongoose from "mongoose";

export class DatabaseConnection {
    static async mongoConnect() {
        try {
            const MONGO_URL = process.env.MONGO_URL;
            const connection = await mongoose.connect(
                `${MONGO_URL}/JOB-SERVICE`,
            );
            console.log(`Job-service db is connected to ${connection}`);
        } catch (error) {
            console.log(error);
             
        }
    }
}