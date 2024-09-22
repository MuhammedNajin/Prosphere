import { KafkaClient } from '@muhammednajinnprosphere/common'

const kafka = new KafkaClient()

const kafkaConnect = async () => {
    await kafka.connect('Auth-service', ['localhost:29092']);   
}

export { kafkaConnect, kafka }