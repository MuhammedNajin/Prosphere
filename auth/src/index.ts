import { app } from './app';
import { intPort } from './config/port';
import { databaseConnection } from "./config/database";
import { kafkaConnect } from './config/kafka';
import 'dotenv/config';




( async function start() {
    try {
        databaseConnection();
       await kafkaConnect();
    } catch (error) {

        console.log(error);
    }

    app.listen(intPort, () => {
        console.log(`auth service is running on port ::${intPort}`);
    
    })

})();


