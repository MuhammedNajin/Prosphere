import { AppError, getEnvs } from "@muhammednajinnprosphere/common";
import { createClient } from "redis";

const { REDIS_URL } = getEnvs("REDIS_URL");

// Define a precise type for the Redis client instance.
// This is derived from the return type of `createClient`, ensuring it always matches the library's type.
export type RedisClient = ReturnType<typeof createClient>;

/**
 * @class RedisConnection
 * @description Manages the Redis client and its connection as a singleton.
 * This pattern ensures a single, shared connection instance across the application,
 * preventing resource leaks and connection management issues.
 */
class RedisConnection {
  private static instance: RedisConnection;
  private client: RedisClient | null = null;
  private isConnected: boolean = false;

  /**
   * The constructor is private to enforce the singleton pattern.
   * It initializes the Redis client and sets up an error listener.
   */
  private constructor() {
    const redisUrl = REDIS_URL;
    console.log("Redis URL:", redisUrl);
    if (!redisUrl) {
      // Fail fast if the Redis URL is not configured.
      throw new AppError(
        "Redis URL is not defined in environment variables.",
        500
      );
    }

    this.client = createClient({ url: redisUrl });

    // Listen for connection errors to log them.
    this.client.on("error", (err: unknown) => {
      console.error("Redis Client Error:", err);
      this.isConnected = false; // Update connection status on error
    });

    this.client.on("connect", () => {
      console.log("Connecting to Redis...");
    });

    this.client.on("ready", () => {
      this.isConnected = true;
      console.log("Redis client is ready.");
    });

    this.client.on("end", () => {
      this.isConnected = false;
      console.log("Redis connection has been closed.");
    });
  }

  /**
   * @method getInstance
   * @static
   * @description Provides access to the singleton instance of the RedisConnection.
   * @returns {RedisConnection} The singleton instance.
   */
  public static getInstance(): RedisConnection {
    if (!RedisConnection.instance) {
      RedisConnection.instance = new RedisConnection();
    }
    return RedisConnection.instance;
  }

  /**
   * @method connect
   * @description Establishes a connection to the Redis server if not already connected.
   * @returns {Promise<void>}
   */
  public async connect(): Promise<void> {
    if (this.isConnected || !this.client) {
      console.log("Redis is already connected or client is not initialized.");
      return;
    }

    let retries = 3;
    while (retries > 0) {
      try {
        await this.client.connect();
        return;
      } catch (error) {
        console.error(
          `Failed to connect to Redis (attempt ${4 - retries}/3):`,
          error
        );
        retries--;
        if (retries === 0) {
          throw new AppError("Could not connect to Redis after retries.", 500);
        }
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1s before retry
      }
    }
  }

  /**
   * @method getClient
   * @description Returns the Redis client instance.
   * Throws an error if the client is not initialized or connected.
   * @returns {RedisClient} The active Redis client.
   */
  public getClient(): RedisClient {
    if (!this.client || !this.isConnected) {
      throw new AppError(
        "Redis client is not available or not connected.",
        503
      );
    }
    return this.client;
  }

  /**
   * @method disconnect
   * @description Gracefully disconnects the Redis client.
   * @returns {Promise<void>}
   */
  public async disconnect(): Promise<void> {
    if (this.client && this.isConnected) {
      await this.client.quit();
    }
  }
}

export const redisClient = RedisConnection.getInstance();
