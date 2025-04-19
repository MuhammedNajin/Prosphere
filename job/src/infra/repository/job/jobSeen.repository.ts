import { Job } from '@infra/database/mongo'

export class JobSeenRepository {
     
    static async jobSeen(_id: string, userId: string): Promise<void> {
      try {

        const exist = await Job.findOne({
           [`veiws.userId`]: userId, 
        })

        console.log("exist", exist);

        if(exist) {
           return 
        }
        

       await Job.updateOne({
            _id 
          },
          {
            $addToSet: { veiws: { userId }}
          },
          {
           runValidators: true
          }
       );

      } catch (error) {
        throw error
      }
    }


}