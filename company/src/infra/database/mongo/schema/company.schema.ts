import mongoose, { Model, Document } from "mongoose";
export interface CompanyAttrs {
  name: string;
  industry?: string;
  description: string;
  organizationSize: string
  organizationType: string
  logo?: string;
  website?: string;
  location: string;
  owner: string;
  url: string
}

export interface CompanyDoc extends Document {
    name: string;
    industry?: string;
    description: string;
    organizationSize: string
    organizationType: string
    logo?: string;
    website?: string;
    location: string;
    owner: string;
    url: string
}

export interface CompanyModel extends Model<CompanyDoc> {
  build(attrs: CompanyAttrs): CompanyDoc;
}

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Company name is required"],
    },

    url: {
      type: String,
      required: [true, "Company urlAddress is required"],
    },

    website: {
      type: String,
      required: false,
    },

    industry: {
      type: String,
      default: "IT", // Set IT as the default industry
    },

    headquarters: {
       type: String,
    },

    location: {
      type: [],

    },
    
    foundedDate: {
      type: Date,
    },

    techStack : {
      type: [String]
    },

    description: {
      type: String,
     
    },

    SocialLinks: {
       type: [String]
    }, 

    logo: {
      type: String,
      required: false,
    },

    team: {
      type: [ mongoose.Schema.Types.ObjectId ]
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, "Owner name is required"],
    },
  },
  { timestamps: true }
);

// Static method to create a new company
companySchema.statics.build = (attrs: CompanyAttrs) => {
  return new Company(attrs);
};

const Company = mongoose.model<CompanyDoc, CompanyModel>("Company", companySchema);

export default Company;
