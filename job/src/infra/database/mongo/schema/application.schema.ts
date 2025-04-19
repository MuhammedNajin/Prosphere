import { ApplicationStatus } from "@/shared/types/enums";
import mongoose, { Model, Document } from "mongoose";

export interface ApplicationAttrs {
  companyId: string;
  jobId: string;
  applicantId: string;
  coverLetter?: string;
  status: ApplicationStatus;
  resume?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  applicationSeen?: boolean;
  interviewSchedules?: Array<{
    title: string;
    time: string;
    status: 'Pending' | 'Completed';
    feedback?: string;
    feedbackDescription?: string;
  }>;
  statusDescription?: {
    title?: string;
    description?: string;
    joiningDate?: Date;
  };
  interviewDate?: Date;
}

export interface ApplicationDoc extends Document {
  companyId: string;
  jobId: string;
  applicantId: string;
  coverLetter?: string;
  status: ApplicationStatus;
  resume?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  applicationSeen: boolean;
  interviewSchedules: Array<{
    title: string;
    time: string;
    status: 'Pending' | 'Completed';
    feedback?: string;
    feedbackDescription?: string;
  }>;
  statusDescription: {
    title?: string;
    description?: string;
    joiningDate?: Date;
  };
  interviewDate?: Date;
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


  coverLetter: {
    type: String,
  },

  status: {
    type: String,
    enum: ['applied', 'inreview', 'shortlisted', 'interview', 'rejected', 'selected'],
    default: 'applied',
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

  applicationSeen: {
    type: Boolean,
    default: false
  },

 

  statusDescription: {
    title: String,
    description: String,
    joiningDate: Date
  },

  interviewDate: {
    type: Date
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