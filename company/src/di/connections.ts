

import { Container } from "inversify";
import { Connections } from "./symbols";
import { initConfig } from "@/config/initConfig";

export const bindConnections = async (container: Container) => {
 
  await initConfig.init({
    enableDatabase: true,
    enableKafka: true
  });

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
