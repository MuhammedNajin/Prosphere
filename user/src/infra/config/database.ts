import mongoose from "mongoose";
import { createClient } from "redis";

const databaseConnection = async () => {
    try {
        const MONGO_URL = process.env.MONGO_URL;
        const connection = await mongoose.connect(
            `${MONGO_URL}/PROFILE-SERVICE`,
        );
        console.log(`profile-service db is connected to ${connection}`);
    } catch (error) {
        console.log(error);
         
    }
}

export const redisClient = createClient({
    url: 'redis://localhost:6379'
})
redisClient.on('error',(err)=> {
    console.log('Redis client error', err)
})

const redisConnection = async () => {
    try {
      await redisClient.connect()
      console.log("connected to redis")
    } catch (error) {
        console.log(error)
    }
}

export { databaseConnection, redisConnection };