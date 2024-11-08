import mongoose, { Model, Document } from "mongoose";

export interface ReplyAttrs {
  userId: string;
  commentText: string;
  createdAt?: Date;
}

export interface CommentAttrs {
  userId: string;
  jobId: string;
  commentText: string;
  replies?: ReplyAttrs[];
}

export interface ReplyDoc {
  userId: string;
  commentText: string;
  createdAt: Date;
}

export interface CommentDoc extends Document {
  userId: string;
  jobId: string;
  commentText: string;
  replies: ReplyDoc[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CommentModel extends Model<CommentDoc> {
  build(attrs: CommentAttrs): CommentDoc;
}

const ReplySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "User ID is required for reply"]
  },
  
  comment: {
    type: String,
    required: [true, "Reply text is required"],
    trim: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});



const CommentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "User ID is required"]
  },
  
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: [true, "Job ID is required"]
  },

  comment: {
    type: String,
    required: [true, "Comment text is required"],
    trim: true
  },

  replies: [ReplySchema],

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

CommentSchema.statics.build = (attrs: CommentAttrs) => {
  return new Comment(attrs);
};

const Comment = mongoose.model<CommentDoc, CommentModel>("Comment", CommentSchema);
export default Comment;