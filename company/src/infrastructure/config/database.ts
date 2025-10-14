import mongoose from "mongoose";


const databaseConnection = async () => {
    try {
        const MONGO_URL = process.env.MONGO_URL;
        const connection = await mongoose.connect(
            `${MONGO_URL}/COMPANY-SERVICE`,
        );
        console.log(`company-service db is connected to ${connection}`);
    } catch (error) {
        console.log(error);
         
    }
}

export { databaseConnection };