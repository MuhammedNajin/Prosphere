import mongoose, { Model, Document } from "mongoose";

export interface ApplicationAttrs {
  companyId: string;
  jobId: string;
  applicantId: string;
  coverLetter?: string;
  status: 'Applied' | 'Inreview' | 'Shortlisted' | 'Interview' | 'Rejected' | 'Selected';
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
  status: 'Applied' | 'Inreview' | 'Shortlisted' | 'Interview' | 'Rejected' | 'Selected';
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
    enum: ['Applied', 'Inreview', 'Shortlisted', 'Interview', 'Rejected', 'Selected'],
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

  applicationSeen: {
    type: Boolean,
    default: false
  },

  interviewSchedules: [{
    title: {
      type: String,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed'],
      default: 'Pending'
    },
    feedback: String,
    feedbackDescription: String
  }],

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