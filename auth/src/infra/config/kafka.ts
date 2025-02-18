import { KafkaClient } from '@muhammednajinnprosphere/common'

const kafka = new KafkaClient()

const kafkaConnect = async () => {
    console.log(
        "MESSAGE_BROKERS, AUTH_CLIENT_ID", 
        process.env.MESSAGE_BROKERS, 
        process.env.AUTH_CLIENT_ID 
     );
    
    await kafka.connect(process.env.AUTH_CLIENT_ID || 'AUTH-SERVICE', 
        [
          process.env.MESSAGE_BROKERS || 'localhost:29092'
        ]
    , 'auth-service-group');   
}

export { kafkaConnect, kafka }