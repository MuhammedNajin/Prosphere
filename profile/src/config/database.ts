import mongoose from "mongoose";


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

export { databaseConnection };