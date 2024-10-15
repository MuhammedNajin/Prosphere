import { createClient } from 'redis';


export const redisClient = createClient({
    url: process.env.REDIS_URL,
})

redisClient.on('error', (err: unknown) => {
    console.log(err)
})

export async function redisConnection() {
    try {
        await redisClient.connect();
        console.log("redis connection established...");
    } catch (error) {
        console.log(error);
    }
}
