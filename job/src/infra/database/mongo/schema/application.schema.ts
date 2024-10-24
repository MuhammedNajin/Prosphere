import mongoose, { Model, Document } from "mongoose";

export interface ApplicationAttrs {
  comapanyId: string;
  jobId: string;
  applicantId: string;
  name?: string;
  phone?: string;
  email?: string;
  coverLetter?: string;
  status: 'Applied' | 'In Review' | 'Interview Scheduled' | 'Accepted' | 'Rejected';
  resume?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
}

export interface ApplicationDoc extends Document {
  comapanyId: string;
  jobId: string;
  applicantId: string;
  name?: string;
  phone?: string;
  email?: string;
  coverLetter?: string;
  status: 'Applied' | 'In Review' | 'Interview Scheduled' | 'Accepted' | 'Rejected';
  resume?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  appliedAt: Date;
  updatedAt: Date;
}

export interface ApplicationModel extends Model<ApplicationDoc> {
  build(attrs: ApplicationAttrs): ApplicationDoc;
}

const ApplicationSchema = new mongoose.Schema({

  companyId: {
     type: mongoose.Schema.Types.ObjectId,
     ref: "Company",
     required: [true, "Company id is required"],
  },

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

  name: {
    type: String,
  },

  phone: {
    type: String,
  },

  email: {
    type: String,
  },
 
  coverLetter: {
    type: String,
  },

  status: {
    type: String,
    enum: ['Applied', 'In Review', 'Interview Scheduled', 'Accepted', 'Rejected'],
    default: 'Applied',
  },

  resume: {
    type: String,
  },

  linkedinUrl: {
    type: String,
  },

  portfolioUrl: {
    type: String,
  },

  appliedAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },

}, { timestamps: true });

ApplicationSchema.statics.build = (attrs: ApplicationAttrs) => {
  return new Application(attrs);
};

const Application = mongoose.model<ApplicationDoc, ApplicationModel>(
  "Application",
  ApplicationSchema
);

export default Application;