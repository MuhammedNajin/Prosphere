import mongoose, { Model, Document } from "mongoose";

// Define the attributes for a Company
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

// Define the document structure for a Company
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

// Define the Company Model with a custom build function
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

    location: {
      type: String,

    }, 

    description: {
      type: String,
     
    },

    logo: {
      type: String,
      required: false,
    },


   

    owner: {
      type: String,
      required: [true, "Company owner is required"],
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
