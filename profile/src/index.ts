import { app } from './app';
import { databaseConnection, redisConnection } from "@infra/config/database";
import { messageBrokerConnect } from '@infra/config/messageBroker';
import dependencies from '@infra/config/dependencies';


(function start() {
    try {
        redisConnection();
        databaseConnection();
        messageBrokerConnect(dependencies);
    } catch (error) {

        console.log(error);
    }
    
    const port = process.env.port;
    app.listen(port, () => {
        console.log(`auth service is running on port ::${port}`);
    
    })

})();


