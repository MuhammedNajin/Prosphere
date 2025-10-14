import mongoose, { Connection } from 'mongoose';
import { AppError, getEnvs } from '@muhammednajinnprosphere/common';

const { MONGO_URL, SERVICE_NAME } = getEnvs("MONGO_URL", "SERVICE_NAME");

export type MongoConnection = Connection;

/**
 * @class DatabaseConnection
 * @description Manages the MongoDB connection as a singleton.
 */
class DatabaseConnection {
    private static instance: DatabaseConnection;
    private connection: MongoConnection | null = null;
    private isConnected: boolean = false;

    private constructor() {
        const mongoUrl = MONGO_URL;
        console.log("MongoDB URL:", mongoUrl);
        
        if (!mongoUrl) {
            throw new AppError(
                'MongoDB URL is not defined in environment variables.',
                500
            );
        }

        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        mongoose.connection.on('connecting', () => {
            console.log('Connecting to MongoDB...');
        });

        mongoose.connection.on('connected', () => {
            this.isConnected = true;
            this.connection = mongoose.connection;
            console.log('MongoDB connection established successfully.');
        });

        mongoose.connection.on('error', (err: unknown) => {
            console.error('MongoDB Connection Error:', err);
            this.isConnected = false;
        });

        mongoose.connection.on('disconnected', () => {
            this.isConnected = false;
            console.log('MongoDB connection has been closed.');
        });

        mongoose.connection.on('reconnected', () => {
            this.isConnected = true;
            console.log('MongoDB reconnected successfully.');
        });
    }

    public static getInstance(): DatabaseConnection {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = new DatabaseConnection();
        }
        return DatabaseConnection.instance;
    }

    public async connect(): Promise<void> {
        if (this.isConnected) {
            console.log('MongoDB is already connected.');
            return;
        }

        try {
            const mongoUrl = MONGO_URL;
            const serviceName = SERVICE_NAME || 'USER-SERVICE';
            
            if (!mongoUrl) {
                throw new AppError(
                    'MongoDB URL is not defined in environment variables.',
                    500
                );
            }

            await mongoose.connect(`${mongoUrl}/${serviceName}`);
            console.log("______________________", `${mongoUrl}/${serviceName}`)
            this.connection = mongoose.connection;
        } catch (error) {
            console.error('Failed to establish MongoDB connection:', error);
            throw new AppError('Could not connect to MongoDB.', 500);
        }
    }

    public getConnection(): MongoConnection {
        if (!this.connection || !this.isConnected) {
            throw new AppError(
                'MongoDB connection is not available or not connected.',
                503
            );
        }
        return this.connection;
    }

    public isConnectionReady(): boolean {
        return this.isConnected && this.connection?.readyState === 1;
    }

    public async disconnect(): Promise<void> {
        if (this.connection && this.isConnected) {
            await mongoose.disconnect();
            this.connection = null;
            this.isConnected = false;
        }
    }
}

export const databaseConnection = DatabaseConnection.getInstance();