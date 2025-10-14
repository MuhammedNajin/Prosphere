import { KafkaConsumer, Topics, CompanyCreatedEvent } from '@muhammednajinnprosphere/common';
import { Consumer, KafkaMessage } from 'kafkajs';
import SubscriptionRepository from '@/infrastructure/repository/subscription.repository'
import { SubscriptionStatus } from '@/shared/types/enums';

export class CompanyCreatedConsumer extends KafkaConsumer<CompanyCreatedEvent> {
  topic: Topics.companyCreated = Topics.companyCreated;

  constructor(consumer: Consumer) {
    super(consumer);
  }

  async onConsume(data: CompanyCreatedEvent['data'], msg: KafkaMessage): Promise<void> {
    try {
      console.log("Received CompanyCreated event", data);
      const trialPlan = {
        id: 0,
        name: "Trial",
        price: 0,
        durationInDays: 7,
        features: ["1 free job posting"],
      };

      // create trial subscription
      await SubscriptionRepository.create({
        companyId: data.id,
        planSnapshot: trialPlan,
        status: SubscriptionStatus.ACTIVE,
        isTrial: true,
        jobsAllowed: 1,
        jobsUsed: 0,
        amountPaid: 0,
        startDate: new Date(),
        endDate: new Date(Date.now() + trialPlan.durationInDays * 24 * 60 * 60 * 1000),
      });

      console.log(`Trial subscription created for company ${data.id}`);
    } catch (error) {
      console.error("Error creating trial subscription:", error);
    }
  }
}
