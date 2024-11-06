import { Application } from '@infra/database/mongo';
import { IApplicationEntity } from '@domain/interface/IEntity';


export class ChangeApplicationStatusRepository {
     
    static async updateStatus(_id: string, status: string, statusDescription: IApplicationEntity['statusDescription']): Promise<IApplicationEntity[] | null> {
        return await Application.findByIdAndUpdate({ _id }, {
            $set: { statusDescription, status }
        },
        { projection: { status: 1, statusDescription: 1 }, new: true }
    );
    }
}