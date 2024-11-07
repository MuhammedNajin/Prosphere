import mongoose, { Model, Document } from "mongoose";

// Interface for location subdocument
interface LocationPoint {
  placename: string;
  type: "Point";
  coordinates: number[];
}

// Interface for the attributes when creating a new company
export interface CompanyAttrs {
  name: string;
  url: string;
  website?: string;
  industry?: string;
  type?: string;
  size?: string;
  headquarters?: string;
  location?: LocationPoint[];
  foundedDate?: Date;
  techStack?: string[];
  description?: string;
  socialLinks?: string[];
  logo?: string;
  team?: mongoose.Types.ObjectId[];
  owner: mongoose.Types.ObjectId;
}

// Interface for the Company document
export interface CompanyDoc extends Document {
  name: string;
  url: string;
  website?: string;
  industry: string;  // Has a default value of "IT"
  type?: string;
  size?: string;
  headquarters?: string;
  location?: LocationPoint[];
  foundedDate?: Date;
  techStack?: string[];
  description?: string;
  socialLinks?: string[];
  logo?: string;
  team?: mongoose.Types.ObjectId[];
  owner: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
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
      default: "IT",
    },
    
    type: {
      type: String,
    },
    
    size: {
      type: String,
    },
    
    headquarters: {
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
    },
    
    location: {
      type: [
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
      required: [true, "location needed"]
    },
    
    foundedDate: {
      type: Date,
    },
    
    techStack: {
      type: [String],
    },
    
    description: {
      type: String,
    },
    
    socialLinks: { 
      type: [String],
    },
    
    logo: {
      type: String,
      required: false,
    },
    
    team: {
      type: [mongoose.Schema.Types.ObjectId],
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

// Create and export the Company model
const Company = mongoose.model<CompanyDoc, CompanyModel>("Company", companySchema);

export default Company;