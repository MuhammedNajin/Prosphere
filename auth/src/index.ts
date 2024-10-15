import { app } from './app';
import { databaseConnection } from "@infra/config/database";
import { kafkaConnect } from '@infra/config/kafka';
import 'dotenv/config';
import { redisConnection } from './infra/database/redis/connection';




( async function start() {
    try {
        redisConnection();
        databaseConnection();
       await kafkaConnect();
    } catch (error) {

        console.log(error);
    }
    
    const PORT = process.env.port || 7000
    app.listen(PORT, () => {
        console.log(`auth service is running on port ::${PORT}`);
    
    })

})();


