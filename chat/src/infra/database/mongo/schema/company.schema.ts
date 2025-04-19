import mongoose, { Model, Document } from "mongoose";

export interface CompanyAttrs {
  _id: string
  name: string;
  owner: string;
  location: string;
}

export interface CompanyDoc extends Document {
  _id: string
  name: string;
  owner: string;
  location: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompanyModel extends Model<CompanyDoc> {
  build(attrs: CompanyAttrs): CompanyDoc;
}

const companySchema = new mongoose.Schema<CompanyDoc, CompanyModel>(
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

companySchema.statics.build = (attrs: CompanyAttrs) => {
  return new Company(attrs);
};



const Company = mongoose.model<CompanyDoc, CompanyModel>("Company", companySchema);

export default Company;