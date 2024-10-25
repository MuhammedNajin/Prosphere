import { Types } from 'mongoose';


export function validateObjectId(_id: string) {
    return Types.ObjectId.isValid(_id)
}