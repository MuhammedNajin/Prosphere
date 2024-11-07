import mongoose, { Model, Document } from "mongoose";

// Define the attributes for creating a new Company
export interface CompanyAttrs {
  _id: string
  name: string;
  owner: string;
  location: string;
}

// Define the document structure for a Company
export interface CompanyDoc extends Document {
  _id: string
  name: string;
  owner: string;
  location: string;
  createdAt: Date;
  updatedAt: Date;
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
    
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, "Owner name is required"],
    },

    location: [
      {
        placename: {
          type: String,
        },
        type: {
          type: String,
          enum: ['Point'],
          default: "Point"
        },
        coordinates: {
          type: [Number],
        },
      }
    ],
  },
  { timestamps: true }
);

// Static method to create a new company
companySchema.statics.build = (attrs: CompanyAttrs) => {
  return new Company(attrs);
};

const Company = mongoose.model<CompanyDoc, CompanyModel>("Company", companySchema);

export default Company;