import { app } from './app';
import { databaseConnection } from "@infra/config/database";
import { kafkaConnect } from '@infra/config/kafka';
import 'dotenv/config';
import { redisConnection } from './infra/database/redis/connection';
import { createServer } from 'http';
import { SocketManager } from './infra/socket';

( async function start() {
    try {
        redisConnection();
        databaseConnection();
       await kafkaConnect();
       const httpServer = createServer(app);
       SocketManager.getInstance(httpServer);

       const PORT = process.env.port || 7000
       httpServer.listen(PORT, () => {
           console.log(`auth service is running on port ::${PORT}`);
       
       })
   
    } catch (error) {

        console.log(error);
        process.exit(1)
    }
    
})();


