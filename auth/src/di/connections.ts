import { initConfig } from "@/config/initConfig";
import { RedisClient } from "@/config/redisConnection";
import { Container } from "inversify";
import { Connections } from "./symbols";

export const bindConnections = async (container: Container) => {
 
  await initConfig.init({
    enableDatabase: true,
    enableRedis: true,
    enableKafka: true
  });

  // 2. Bind only if initialized
  if (initConfig.isConnectionInitialized("redis")) {
    const redisConnection = initConfig.getConnection<RedisClient>("redis");
    container
      .bind<RedisClient>(Connections.RedisClient)
      .toConstantValue(redisConnection);
    console.log("[DI] RedisClient bound");
  }

  if (initConfig.isConnectionInitialized("database")) {
    const databaseConnection = initConfig.getConnection("database");
    container
      .bind(Connections.DatabaseConnection)
      .toConstantValue(databaseConnection);
    console.log("[DI] DatabaseConnection bound");
  }

  if (initConfig.isConnectionInitialized("kafka")) {
    const kafkaConnection = initConfig.getConnection("kafka");
    container
      .bind(Connections.KafkaConnection)
      .toConstantValue(kafkaConnection);
    console.log("[DI] KafkaConnection bound");
  }

  console.log("[DI] All connection bindings complete");
};
