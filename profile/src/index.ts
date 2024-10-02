import { app } from './app';
import { databaseConnection } from "./config/database";
import { messageBrokerConnect } from './config/messageBroker'
import dependencies from './config/dependencies'





(function start() {
    try {
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


