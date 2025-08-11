/**
 * @interface ICacheService
 * @description Defines the contract for a generic Redis repository, specifying the methods for setting, getting, and deleting key-value pairs.
 */

export interface ICacheService {
    /**
     * @method set
     * @description Stores a key-value pair in Redis with an optional Time-To-Live (TTL).
     * @param {string} key - The key under which to store the value.
     * @param {string} value - The value to store.
     * @param {number} [ttl] - Optional. The expiration time in seconds.
     * @returns {Promise<void>} A promise that resolves when the operation is complete.
     */
    set(key: string, value: string, ttl?: number): Promise<void>;
  
    /**
     * @method get
     * @description Retrieves the value associated with a key from Redis.
     * @param {string} key - The key whose value to retrieve.
     * @returns {Promise<string | null>} A promise that resolves with the value, or null if the key does not exist.
     */
    get(key: string): Promise<string | null>;
  
    /**
     * @method delete
     * @description Deletes a key-value pair from Redis.
     * @param {string} key - The key to delete.
     * @returns {Promise<void>} A promise that resolves when the key is successfully deleted.
     */
    del(key: string): Promise<void>;
  }