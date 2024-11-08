export class CommentEntity {
    constructor(
      public id: string,
      public userId: string,
      public jobId: string,
      public text: string,
      public createdAt: Date,
    ) {}
  }
  