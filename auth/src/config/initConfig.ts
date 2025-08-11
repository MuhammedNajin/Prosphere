import { AppError } from '@muhammednajinnprosphere/common';
import { databaseConnection } from './connectMongoDb';
import { redisClient } from './redisConnection';
import { kafkaConnect } from '@/infrastructure/config/kafka';

/**
 * @interface InitConfigOptions
 * @description Configuration options for initialization
 */
interface InitConfigOptions {
    enableDatabase?: boolean;
    enableRedis?: boolean;
    enableKafka?: boolean;
    timeout?: number; // Timeout in milliseconds for each connection
}

/**
 * @function initConfig
 * @description Initializes all application configurations and connections in the correct order.
 * This function centralizes all connection logic and provides proper error handling.
 * @param {InitConfigOptions} options - Configuration options
 * @returns {Promise<void>}
 */
export async function initConfig(options: InitConfigOptions = {}): Promise<void> {
    const {
        enableDatabase = true,
        enableRedis = true,
        enableKafka = true,
        timeout = 30000 // 30 seconds default timeout
    } = options;

    console.log('🚀 Starting application configuration initialization...');

    try {
        // Initialize database connection
        if (enableDatabase) {
            console.log('📊 Initializing database connection...');
            await withTimeout(
                databaseConnection.connect(),
                timeout,
                'Database connection timeout'
            );
            console.log('✅ Database connection established successfully');
        }

        // Initialize Redis connection
        if (enableRedis) {
            console.log('Initializing Redis connection...');
            await withTimeout(
                redisClient.connect(),
                timeout,
                'Redis connection timeout'
            );
            console.log('✅ Redis connection established successfully');
        }

        // Initialize Kafka connection
        if (enableKafka) {
            console.log('📨 Initializing Kafka connection...');
            await withTimeout(
                kafkaConnect(),
                timeout,
                'Kafka connection timeout'
            );
            console.log('✅ Kafka connection established successfully');
        }

        console.log('🎉 All configurations initialized successfully!');

    } catch (error) {
        console.error('❌ Failed to initialize application configurations:', error);
        
        // Attempt to cleanup any partially initialized connections
        await cleanupConnections();
        
        throw new AppError(
            `Configuration initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
            500
        );
    }
}

/**
 * @function cleanupConnections
 * @description Gracefully closes all connections during shutdown or on initialization failure.
 * @returns {Promise<void>}
 */
export async function cleanupConnections(): Promise<void> {
    console.log('🧹 Starting graceful cleanup of connections...');

    const cleanupPromises: Promise<void>[] = [];

    try {
        // Cleanup database connection if it exists
        if (databaseConnection.isConnectionReady()) {
            console.log('🗄️ Closing database connection...');
            cleanupPromises.push(
                databaseConnection.disconnect().catch((err) => {
                    console.error('Error closing database connection:', err);
                })
            );
        }

        // Cleanup Redis connection if it exists
        try {
            const redis = redisClient.getClient();
            if (redis) {
                console.log('🔴 Closing Redis connection...');
                cleanupPromises.push(
                    redisClient.disconnect().catch((err) => {
                        console.error('Error closing Redis connection:', err);
                    })
                );
            }
        } catch {
            // Redis client might not be available, ignore
        }

        // Wait for all cleanup operations to complete
        await Promise.allSettled(cleanupPromises);
        
        console.log('✅ All connections cleaned up successfully');

    } catch (error) {
        console.error('❌ Error during connection cleanup:', error);
    }
}

/**
 * @function withTimeout
 * @description Wraps a promise with a timeout mechanism
 * @param {Promise<T>} promise - The promise to wrap
 * @param {number} timeoutMs - Timeout in milliseconds
 * @param {string} errorMessage - Custom error message for timeout
 * @returns {Promise<T>}
 */
function withTimeout<T>(
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
 * @function getConnectionStatus
 * @description Returns the current status of all connections
 * @returns {object} Connection status object
 */
export function getConnectionStatus() {
    let redisStatus = false;
    
    try {
        redisClient.getClient();
        redisStatus = true;
    } catch {
        redisStatus = false;
    }

    return {
        database: databaseConnection.isConnectionReady(),
        redis: redisStatus,
        timestamp: new Date().toISOString()
    };
}

/**
 * @function healthCheck
 * @description Performs a health check on all connections
 * @returns {Promise<object>} Health check results
 */
export async function healthCheck() {
    const status = getConnectionStatus();
    const isHealthy = status.database && status.redis;

    return {
        status: isHealthy ? 'healthy' : 'unhealthy',
        connections: status,
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    };
}