
import { AppError, KafkaClient } from '@muhammednajinnprosphere/common';
import { databaseConnection } from './db-connection';
import { kafkaConnection } from './kafka-connection';

interface InitConfigOptions {
    enableDatabase?: boolean;
    enableKafka?: boolean;
    timeout?: number;
    retries?: number;
}

interface ConnectionState {
    database?: any;
    kafka?: KafkaClient;
    dependencies?: any;
}

export class InitConfig {
    private connections: ConnectionState = {};

    /**
     * Initialize all application connections
     */
    async init(options: InitConfigOptions = {}): Promise<void> {
        const {
            enableDatabase = true,
            enableKafka = true,
            timeout = 30000,
            retries = 3
        } = options;

        console.log('Starting connection initialization...');
        
        this.connections = {};
        const initResults: Record<string, boolean> = {};

        try {
            // Initialize database connection
            if (enableDatabase) {
                console.log('Initializing database connection...');
                try {
                    await this.withRetry(
                        () => this.withTimeout(
                            databaseConnection.connect(),
                            timeout,
                            'Database connection timeout'
                        ),
                        retries
                    );
                    this.connections.database = databaseConnection;
                    initResults.database = true;
                    console.log('Database connection established successfully');
                } catch (error) {
                    initResults.database = false;
                    console.error('Database connection failed:', error);
                    throw error;
                }
            }

            // Initialize dependencies
            console.log('Initializing dependencies...');
            try {
                
                initResults.dependencies = true;
                console.log('Dependencies initialized successfully');
            } catch (error) {
                initResults.dependencies = false;
                console.error('Dependencies initialization failed:', error);
                throw error;
            }

            // Initialize Kafka connection
            if (enableKafka) {
                console.log('📨 Initializing Kafka connection...');
                try {
                   const kafka = await this.withRetry(
                        () => this.withTimeout(
                            kafkaConnection.connect(),
                            timeout,
                            'Kafka connection timeout'
                        ),
                        retries
                    );
                    this.connections.kafka = kafka;
                    initResults.kafka = true;
                    console.log('Kafka connection established successfully');
                } catch (error) {
                    initResults.kafka = false;
                    console.error('Kafka connection failed:', error);
                    throw error;
                }
            }

            const successCount = Object.values(initResults).filter(Boolean).length;
            const totalCount = Object.keys(initResults).length;
            
            console.log(`Connection initialization completed! (${successCount}/${totalCount} successful)`);

        } catch (error) {
            console.error('Failed to initialize connections:', error);
            await this.cleanup();
            throw new AppError(
                `Connection initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                500
            );
        }
    }

    /**
     * Gracefully cleanup all connections
     */
    async cleanup(): Promise<void> {
        console.log('Starting graceful cleanup of connections...');

        const cleanupTasks: Promise<void>[] = [];

        try {
            // Cleanup database connection
            if (this.connections.database && databaseConnection.isConnectionReady?.()) {
                console.log('Closing database connection...');
                cleanupTasks.push(
                    databaseConnection.disconnect().catch((err: Error) => {
                        console.error('Error closing database connection:', err);
                    })
                );
            }

            // Cleanup Kafka connection
            if (this.connections.kafka && kafkaConnection.isConnected()) {
                console.log('Closing Kafka connection...');
                cleanupTasks.push(
                    kafkaConnection.disconnect().catch((err: Error) => {
                        console.error('Error closing Kafka connection:', err);
                    })
                );
            }

            await Promise.allSettled(cleanupTasks);
            this.connections = {};
            console.log('All connections cleaned up successfully');

        } catch (error) {
            console.error('Error during connection cleanup:', error);
        }
    }

    /**
     * Check if a specific connection is initialized
     */
    isConnectionInitialized(connectionName: string): boolean {
        switch (connectionName.toLowerCase()) {
            case 'database':
                return !!this.connections.database;
            case 'kafka':
                return !!this.connections.kafka;
            case 'dependencies':
                return !!this.connections.dependencies;
            default:
                return false;
        }
    }

    /**
     * Get a specific connection
     */
    getConnection(connectionName: string) {
        switch (connectionName.toLowerCase()) {
            case 'database':
                if (!this.connections.database) {
                    throw new AppError('Database connection is not initialized', 500);
                }
                return this.connections.database ;
            case 'kafka':
                if (!this.connections.kafka) {
                    throw new AppError('Kafka connection is not initialized', 500);
                }
                return this.connections.kafka ;
            default:
                throw new AppError(`Unknown connection type: ${connectionName}`, 400);
        }
    }

    /**
     * Get connection status for all or specific connection
     */
    getConnectionStatus(connectionName?: string) {
        if (connectionName) {
            return {
                [connectionName]: this.isConnectionInitialized(connectionName),
                timestamp: new Date().toISOString()
            };
        }
        
        return {
            connections: {
                database: this.isConnectionInitialized('database'),
                kafka: this.isConnectionInitialized('kafka'),
                dependencies: this.isConnectionInitialized('dependencies')
            },
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Health check for all connections
     */
    async healthCheck() {
        const connectionStates = {
            database: this.isConnectionInitialized('database') && databaseConnection.isConnectionReady(),
            kafka: this.isConnectionInitialized('kafka') && kafkaConnection.isConnected(),
            dependencies: this.isConnectionInitialized('dependencies')
        };
        
        const activeConnections = Object.values(connectionStates).filter(Boolean).length;
        const totalConnections = Object.keys(connectionStates).length;
        const isHealthy = activeConnections > 0;

        return {
            status: isHealthy ? 'healthy' : 'unhealthy',
            connections: connectionStates,
            activeConnections,
            totalConnections,
            uptime: process.uptime(),
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Utility functions for getting specific connections
     */
    getDatabaseConnection = () => this.getConnection('database');
    getKafkaConnection = () => this.getConnection('kafka');
    getDependencies = () => this.getConnection('dependencies');

    /**
     * Timeout wrapper for promises
     */
    private withTimeout<T>(
        promise: Promise<T>,
        timeoutMs: number,
        errorMessage: string = 'Operation timeout'
    ): Promise<T> {
        const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => {
                reject(new AppError(`${errorMessage} (${timeoutMs}ms)`, 408));
            }, timeoutMs);
        });

        return Promise.race([promise, timeoutPromise]);
    }

    /**
     * Retry mechanism for connection attempts
     */
    private async withRetry<T>(
        operation: () => Promise<T>,
        maxRetries: number,
        delay: number = 1000
    ): Promise<T> {
        let lastError: Error;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await operation();
            } catch (error) {
                lastError = error as Error;
                
                if (attempt === maxRetries) {
                    throw lastError;
                }

                console.warn(`⚠️ Attempt ${attempt} failed, retrying in ${delay * attempt}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay * attempt));
            }
        }

        throw lastError!;
    }
}

// Export a singleton instance
export const initConfig = new InitConfig();