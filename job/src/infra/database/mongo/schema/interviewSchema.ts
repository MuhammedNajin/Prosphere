import mongoose, { Model, Document } from "mongoose";

export enum InterviewStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  RESCHEDULED = 'rescheduled'
}

export enum InterviewType {
  IN_PERSON = 'in-person',
  PHONE = 'phone',
  VIDEO = 'video'
}

export interface InterviewAttrs {
  jobId: string;
  companyId: string;
  candidateId: string;
  scheduledTime: Date;
  interviewType: InterviewType;
  locationOrLink?: string;
  status: InterviewStatus;
  feedback?: string;
  title?: string;
  interviewers?: string[];
  duration?: number; 
  notes?: string;
  round?: number;
  feedbackRating?: number;
  technicalScore?: number;
  communicationScore?: number;
  cultureFitScore?: number;
}


export interface InterviewDoc extends Document {
  jobId: string;
  companyId: string;
  candidateId: string;
  scheduledTime: Date;
  interviewType: InterviewType;
  locationOrLink?: string;
  status: InterviewStatus;
  feedback?: string;
  title?: string;
  interviewers?: string[];
  duration?: number;
  notes?: string;
  round?: number;
  feedbackRating?: number;
  technicalScore?: number;
  communicationScore?: number;
  cultureFitScore?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface InterviewModel extends Model<InterviewDoc> {
  build(attrs: InterviewAttrs): InterviewDoc;
}

const InterviewSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: [true, 'Job ID is required'],
  },

  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, 'Company ID is required'],
  },

  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Candidate ID is required'],
  },

  scheduledTime: {
    type: Date,
    required: [true, 'Interview time is required'],
  },

  interviewType: {
    type: String,
    enum: Object.values(InterviewType),
    required: [true, 'Interview type is required'],
  },

  location: {
    placename: {
      type: String,
    },

    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
    },
  },

  status: {
    type: String,
    enum: Object.values(InterviewStatus),
    default: InterviewStatus.SCHEDULED,
  },

  feedback: {
    type: String,
  },

  title: {
    type: String,
  },

  interviewers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],

  duration: {
    type: Number,
  },

  notes: {
    type: String,
  },

  round: {
    type: Number,
  },

  feedbackRating: {
    type: Number,
    min: 0,
    max: 5,
  },

  technicalScore: {
    type: Number,
    min: 0,
    max: 10,
  },

  communicationScore: {
    type: Number,
    min: 0,
    max: 10,
  },

  cultureFitScore: {
    type: Number,
    min: 0,
    max: 10,
  },
}, { timestamps: true });

InterviewSchema.statics.build = (attrs: InterviewAttrs) => {
  return new Interview(attrs);
};

const Interview = mongoose.model<InterviewDoc, InterviewModel>(
  'Interview',
  InterviewSchema
);

export default Interview;