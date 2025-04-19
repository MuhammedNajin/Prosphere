import { Comment } from '@infra/database/mongo'
import { CommentAttrs } from '@/infra/database/mongo/schema/JobComment.schema';

export class AddCommentRepository {
     
    static async addComment(comment: CommentAttrs) {
       return await Comment.build(comment).save();
    }

}