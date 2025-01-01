import { app } from './app';
import { databaseConnection, redisConnection } from "@infra/config/database";
import { messageBrokerConnect } from '@infra/config/messageBroker';
import { GrpcServer } from "@infra/rpc/grpc/userGrpcServer"
import dependencies from '@infra/config/dependencies';


(function start() {
    try {
        databaseConnection();
        messageBrokerConnect(dependencies);
        new GrpcServer(dependencies).start();
    } catch (error) {

        console.log(error);
    }
    
    const port = process.env.port;
    app.listen(port, () => {
        console.log(`auth service is running on port ::${port}`);
    
    })

})();


