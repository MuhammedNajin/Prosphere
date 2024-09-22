import { app } from './app';
import { databaseConnection } from "./config/database";
import 'dotenv/config';




(function start() {
    try {
        databaseConnection();
    } catch (error) {

        console.log(error);
    }
    
    const port = process.env.port;
    app.listen(port, () => {
        console.log(`auth service is running on port ::${port}`);
    
    })

})();


