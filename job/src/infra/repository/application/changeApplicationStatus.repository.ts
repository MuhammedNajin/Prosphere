import { Application } from '@infra/database/mongo';
import { IApplicationEntity } from '@domain/interface/IEntity';
import { ApplicationStatus } from '@/shared/types/enums';
import { BadRequestError,  } from '@muhammednajinnprosphere/common';


export class ChangeApplicationStatusRepository {
    
    
    static async updateStatus(_id: string, status: ApplicationStatus, statusDescription: IApplicationEntity['statusDescription']): Promise<IApplicationEntity[] | null> {
       const status_table = new Map([
            [ApplicationStatus.APPLIED, 0],
            [ApplicationStatus.IN_REVIEW, 1],
            [ApplicationStatus.SHORTLISTED, 2],
            [ApplicationStatus.INTERVIEW, 3],
            [ApplicationStatus.SELECTED, 4],
            [ApplicationStatus.REJECTED, 5],
        ]);

        const application = await Application.findOne({ _id });

        if(!application) {
            throw new BadRequestError('Application not found');
        }

        const currentStatus = application.status;

        console.log("currentStatus", currentStatus, "newStatus", status);

        if(currentStatus === ApplicationStatus.REJECTED) {
            throw new BadRequestError(`Status: ${ApplicationStatus.REJECTED}, Can't change the status, already rejected`);
        }

       
        if(status_table.get(currentStatus) <  status_table.get(status)) {
             application.status = status;
             application.statusDescription = statusDescription;

         await application.save()
        }
        
        return application;
    }
}