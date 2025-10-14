import { AppError, KafkaClient } from '@muhammednajinnprosphere/common';

/**
 * @class KafkaConnection
 * @description Manages the Kafka client connection using a Singleton pattern.
 */
class KafkaConnection {
    private static instance: KafkaConnection;
    public kafkaClient: KafkaClient;
    private _isConnected = false;

    private constructor() {
        this.kafkaClient = new KafkaClient();
    }

    public static getInstance(): KafkaConnection {
        if (!KafkaConnection.instance) {
            KafkaConnection.instance = new KafkaConnection();
        }
        return KafkaConnection.instance;
    }

    public async connect(): Promise<KafkaClient> {
        if (this._isConnected) {
            console.warn('Kafka client is already connected.');
            return this.kafkaClient;
        }

        const clientId = process.env.USER_CLIENT_ID || 'COMPANY-SERVICE';
        const brokers = process.env.MESSAGE_BROKERS?.split(',') || ['localhost:29092'];
        const groupId = process.env.KAFKA_GROUP || 'profile-service-group';

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

    public async createConsumer(groupId: string) {
        return this.kafkaClient.createConsumer(groupId)
    }

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

    public getClient(): KafkaClient {
        if (!this._isConnected || !this.kafkaClient) {
            throw new AppError('Kafka client is not available. Please call connect() first.', 500);
        }
        return this.kafkaClient;
    }

    public isConnected(): boolean {
        return this._isConnected;
    }
}

export const kafkaConnection = KafkaConnection.getInstance();