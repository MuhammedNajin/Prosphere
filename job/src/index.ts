
import dotenv from 'dotenv';
import { DatabaseConnection } from '@infra/config/database';
import { MessageBrokerConnection } from '@infra/config/messageBroker';
import { App } from './app';
import { Dependency } from '@infra/config/dependencies';

const bootstrap = async () => {
    try {
    
        dotenv.config();
        const dependencies = new Dependency();
        console.log("Dependencies initialized:", dependencies.useCase);
        await DatabaseConnection.mongoConnect();
        console.log("Database connected successfully");
        await MessageBrokerConnection.connect(dependencies.useCase);
        console.log("Message broker connected successfully");
        
       
        new App(dependencies);
     
        
        console.log("Application started successfully");
        
   
        process.on('SIGTERM', async () => {
            console.log('SIGTERM signal received. Closing connections...');
            await cleanup();
        });
        
        process.on('SIGINT', async () => {
            console.log('SIGINT signal received. Closing connections...');
            await cleanup();
        });
        
    } catch (error) {
        console.error('Error during application startup:', error);
        await cleanup();
        process.exit(1);
    }
};

const cleanup = async () => {
    try {
        
        await DatabaseConnection.disconnect();
        await MessageBrokerConnection.disconnect();
        
        console.log('Cleanup completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error during cleanup:', error);
        process.exit(1);
    }
};

bootstrap().catch((error) => {
    console.error('Unhandled error during bootstrap:', error);
    process.exit(1);
});