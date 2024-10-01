import { app } from './app';
import dotenv from 'dotenv';
import { databaseConnection } from './infra/config/database'
import { messageBrokerConnect } from './infra/config/messageBroker'
import dependecies from './infra/config/dependecies';

dotenv.config();

(function start() {
    try {

        databaseConnection();
        messageBrokerConnect(dependecies);

    } catch (error) {

        console.log(error);
    }
    
    const port = process.env.port;
    app.listen(port, () => {
        console.log(`auth service is running on port ::${port}`);
    
    })

})();


