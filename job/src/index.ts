import { App } from "./app"
import { DatabaseConnection } from '@infra/config/database'
import  { Dependency  } from '@infra/config/dependencies'
import { MessageBrokerConnection } from '@infra/config/messageBroker'
import dotenv from 'dotenv';



(() => {

    dotenv.config();
    DatabaseConnection.mongoConnect();
    // MessageBrokerConnection.connect();
    console.log("dependencies", new Dependency().useCase)
    new App(new Dependency())

})();