import { Comment } from '@infra/database/mongo'

export class GetCommentRepository {
     
    static async getComment(jobId: string) {
       return await Comment.find({ jobId }).populate({
        path: 'userId',
        select: ['_id', 'username']
       })
    }

}