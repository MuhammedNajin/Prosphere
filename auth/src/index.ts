import { app } from './app';
import { intPort } from './config/port';
import { databaseConnection } from "./config/database";
import 'dotenv/config';




(function start() {
    try {
        databaseConnection();
    } catch (error) {

        console.log(error);
    }

    app.listen(intPort, () => {
        console.log(`auth service is running on port ::${intPort}`);
    
    })

})();


