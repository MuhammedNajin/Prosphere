import cron from 'node-cron';
import subscriptionRepository from '../repository/subscription.repository';
export const setUpCrons = () => {
     try {

        cron.schedule('0 0 * * *', async () => {
          await subscriptionRepository.updateExpiredSubscriptions()
        });

     } catch (error) {
        console.log(error);

     }
}