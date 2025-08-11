import { RedisClient } from "@config/redisConnection";
import { ICacheService } from "@/infrastructure/interface/service/ICacheService";
import { inject, injectable } from "inversify";
import { Services } from "@/di/symbols";

/**
 * @class RedisRepository
 * @implements {ICacheService}
 * @description Provides a generic implementation for interacting with Redis, allowing for setting, getting, and deleting data.
 */

@injectable()
export class CacheService implements ICacheService {
  private readonly client: RedisClient;

  constructor(@inject(Services.RedisClient) client: RedisClient) {
    this.client = client;
  }

  /**
   * @method set
   * @description Implements the set functionality. It uses `setEx` if a TTL is provided, otherwise it uses `set`.
   */
  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      // If a TTL is provided, set the key with an expiration.
      await this.client.setEx(key, ttl, value);
    } else {
      // Otherwise, set the key without an expiration.
      await this.client.set(key, value);
    }
  }

  /**
   * @method get
   * @description Implements the get functionality.
   */
  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  /**
   * @method del
   * @description Implements the delete functionality using the 'del' command.
   */
  async del(key: string): Promise<void> {
    await this.client.del(key);
  }
}