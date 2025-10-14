// kafka.ts

import { KafkaClient, AppError } from '@muhammednajinnprosphere/common';

/**
 * @class KafkaConnection
 * @description Manages the Kafka client connection using a Singleton pattern.
 * This ensures that only one instance of the Kafka client is created and used
 * throughout the application.
 */
export class KafkaConnection {
    private static instance: KafkaConnection;
    public kafkaClient: KafkaClient;
    private _isConnected = false;

    /**
     * The constructor is private to enforce the Singleton pattern.
     * It initializes the KafkaClient.
     */
    private constructor() {
        this.kafkaClient = new KafkaClient();
    }

    /**
     * Provides the singleton instance of the KafkaConnection.
     * @returns {KafkaConnection} The singleton instance.
     */
    public static getInstance(): KafkaConnection {
        if (!KafkaConnection.instance) {
            KafkaConnection.instance = new KafkaConnection();
        }
        return KafkaConnection.instance;
    }

    /**
     * Establishes a connection to the Kafka brokers.
     * It retrieves configuration from environment variables with sensible defaults.
     * @throws {AppError} If the connection fails.
     */
    public async connect(): Promise<KafkaClient> {
        if (this._isConnected) {
            console.warn('Kafka client is already connected.');
            return this.kafkaClient;
        }

        const clientId = process.env.AUTH_CLIENT_ID || 'AUTH-SERVICE';
        const brokers = [process.env.MESSAGE_BROKERS || 'localhost:29092'];
        const groupId = 'auth-service-group';

        console.log(`🔌 Attempting to connect to Kafka with client ID "${clientId}"...`);

        try {
            await this.kafkaClient.connect(clientId, brokers, groupId);
            this._isConnected = true;
            console.log('Kafka client connected successfully.');
            return this.kafkaClient
        } catch (error) {
            console.error('Failed to connect to Kafka:', error);
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            throw new AppError(`Kafka connection failed: ${errorMessage}`, 500);
        }
    }

    /**
     * Gracefully disconnects the Kafka client.
     */
    public async disconnect(): Promise<void> {
        if (!this._isConnected) {
            return;
        }
        try {
            console.log('🔌 Disconnecting Kafka client...');
            await this.kafkaClient.disconnect();
            this._isConnected = false;
            console.log('Kafka client disconnected successfully.');
        } catch (error) {
            console.error('Failed to disconnect Kafka client gracefully:', error);
        }
    }

    /**
     * Retrieves the underlying KafkaClient instance.
     * @returns {KafkaClient} The connected Kafka client.
     * @throws {AppError} If the client is not connected.
     */
    public getClient(): KafkaClient {
        if (!this._isConnected || !this.kafkaClient) {
            throw new AppError('Kafka client is not available. Please call connect() first.', 500);
        }
        return this.kafkaClient;
    }

    /**
     * Checks the current connection status.
     * @returns {boolean} True if the client is connected, false otherwise.
     */
    public isConnected(): boolean {
        return this._isConnected;
    }
}

// Export a single instance for the entire application to use.
export const kafkaConnection = KafkaConnection.getInstance();