import mongoose, { Model, Document } from "mongoose";

export interface JobAttrs {
  jobTitle: string;
  employment: string;
  jobDescription: string;
  jobLocation: string;
  salary: {
    status: boolean;
    from: number;
    to: number;
  };
  vacancies: number;
  experience: string;
  companyId: string;
  expiry: Date;
  responsibility: string[];
  skills: string[];
  qualifications: string[];
  status?: boolean;
  expired?: boolean;
}

// Define the document structure for a Job
export interface JobDoc extends Document {
  jobTitle: string;
  employment: string;
  jobDescription: string;
  jobLocation: string;
  salary: {
    status: boolean;
    from: number;
    to: number;
  };
  vacancies: number;
  experience: string;
  companyId: string;
  expiry: Date;
  responsibility: string[];
  skills: string[];
  qualifications: string[];
  status: boolean;
  expired: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Job Model with a custom build function
export interface JobModel extends Model<JobDoc> {
  build(attrs: JobAttrs): JobDoc;
}

const jobSchema = new mongoose.Schema(
  {
    jobTitle: {
      type: String,
      required: [true, "Job title is required"],
    },
    employment: {
      type: String,
      required: [true, "Employment type is required"],
    },
    jobDescription: {
      type: String,
      required: [true, "Job description is required"],
    },
    jobLocation: {
      type: String,
      required: [true, "Job location is required"],
    },
    salary: {
      status: Boolean,
      from: Number,
      to: Number,
    },
    vacancies: {
      type: Number,
      required: [true, 'vacancies required']
    },
    experience: {
      type: String,
      required: [true, "Experience is required"],
    },
    companyId: {
      type: mongoose.Schema.ObjectId,
      required: [true, "Company ID is required"],
      ref: "Company",
    },
    expiry: {
      type: Date,
      required: [true, "Expiry date is required"],
    },
    responsibility: {
      type: [String],
      required: [true, "Responsibilities are required"],
    },
    skills: {
      type: [],
      required: [true, "Skills are required"],
    },
    qualifications: {
      type: [String],
      required: [true, "Qualifications are required"],
    },
    status: {
      type: Boolean,
      default: true,
    },
    expired: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Static method to create a new job
jobSchema.statics.build = (attrs: JobAttrs) => {
  return new Job(attrs);
};

const Job = mongoose.model<JobDoc, JobModel>("Job", jobSchema);

export default Job;