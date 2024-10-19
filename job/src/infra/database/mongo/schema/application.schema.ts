import mongoose, { Model, Document } from "mongoose";

export interface ApplicationAttrs {
  jobId: string;
  applicantId: string;
  coverLetter?: string;
  status: 'Applied' | 'In Review' | 'Interview Scheduled' | 'Accepted' | 'Rejected';
  notes?: string;
}

export interface ApplicationDoc extends Document {
  jobId: string;
  applicantId: string;
  coverLetter: string;
  status: 'Applied' | 'In Review' | 'Interview Scheduled' | 'Accepted' | 'Rejected';
  appliedAt?: Date;
  updatedAt?: Date;
  notes: string;
}

export interface ApplicationModel extends Model<ApplicationDoc> {
  build(attrs: ApplicationAttrs): ApplicationDoc;
}

const ApplicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: [true, "Job ID is required"],
  },

  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "Applicant ID is required"],
  },
 
  coverLetter: {
    type: String,
  },

  status: {
    type: String,
    enum: ['Applied', 'In Review', 'Interview Scheduled', 'Accepted', 'Rejected'],
    default: 'Applied',
  },

  appliedAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },

  notes: {
    type: String,
  },

}, 

{ timestamps: true }

);

ApplicationSchema.statics.build = (attrs: ApplicationAttrs) => {
  return new Application(attrs);
};

const Application = mongoose.model<ApplicationDoc, ApplicationModel>(
  "Application",
  ApplicationSchema
);

export default Application;