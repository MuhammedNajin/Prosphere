import { AppError, getEnvs } from '@muhammednajinnprosphere/common';
import mongoose, { Connection } from 'mongoose';

const { MONGO_URL } = getEnvs(
  "MONGO_URL"
);

// Define a precise type for the MongoDB connection instance.
export type MongoConnection = Connection;

/**
 * @class DatabaseConnection
 * @description Manages the MongoDB connection as a singleton.
 * This pattern ensures a single, shared connection instance across the application,
 * preventing resource leaks and connection management issues.
 */
class DatabaseConnection {
    private static instance: DatabaseConnection;
    private connection: MongoConnection | null = null;
    private isConnected: boolean = false;

    /**
     * The constructor is private to enforce the singleton pattern.
     * It sets up the MongoDB connection configuration and event listeners.
     */
    private constructor() {
        const mongoUrl = MONGO_URL;
        console.log("MongoDB URL:", mongoUrl);
        
        if (!mongoUrl) {
            // Fail fast if the MongoDB URL is not configured.
            throw new AppError(
                'MongoDB URL is not defined in environment variables.',
                500,
            );
        }

        // Set up event listeners for the default mongoose connection
        mongoose.connection.on('connecting', () => {
            console.log('Connecting to MongoDB...');
        });

        mongoose.connection.on('connected', () => {
            this.isConnected = true;
            this.connection = mongoose.connection;
            console.log('MongoDB connection established successfully.');
        });

        mongoose.connection.on('ready', () => {
            console.log('MongoDB client is ready.');
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

    /**
     * @method getInstance
     * @static
     * @description Provides access to the singleton instance of the DatabaseConnection.
     * @returns {DatabaseConnection} The singleton instance.
     */
    public static getInstance(): DatabaseConnection {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = new DatabaseConnection();
        }
        return DatabaseConnection.instance;
    }

    /**
     * @method connect
     * @description Establishes a connection to the MongoDB server if not already connected.
     * @returns {Promise<void>}
     */
    public async connect(): Promise<void> {
        if (this.isConnected) {
            console.log('MongoDB is already connected.');
            return;
        }

        try {
            const mongoUrl = MONGO_URL;
            if (!mongoUrl) {
                throw new AppError(
                    'MongoDB URL is not defined in environment variables.',
                    500,
                );
            }

            await mongoose.connect(`${mongoUrl}/AUTH-SERVICE`);
            this.connection = mongoose.connection;
        } catch (error) {
            console.error('Failed to establish MongoDB connection:', error);
            throw new AppError(
                'Could not connect to MongoDB.',
                500,
            );
        }
    }

    /**
     * @method getConnection
     * @description Returns the MongoDB connection instance.
     * Throws an error if the connection is not available.
     * @returns {MongoConnection} The active MongoDB connection.
     */
    public getConnection(): MongoConnection {
        if (!this.connection || !this.isConnected) {
            throw new AppError(
                'MongoDB connection is not available or not connected.',
                503,
            );
        }
        return this.connection;
    }

    /**
     * @method isConnectionReady
     * @description Checks if the connection is ready.
     * @returns {boolean} True if connected, false otherwise.
     */
    public isConnectionReady(): boolean {
        return this.isConnected && this.connection?.readyState === 1;
    }

    /**
     * @method disconnect
     * @description Gracefully disconnects from MongoDB.
     * @returns {Promise<void>}
     */
    public async disconnect(): Promise<void> {
        if (this.connection && this.isConnected) {
            await mongoose.disconnect();
            this.connection = null;
            this.isConnected = false;
        }
    }
}

export const databaseConnection = DatabaseConnection.getInstance();