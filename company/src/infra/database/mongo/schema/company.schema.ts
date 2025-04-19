import mongoose, { Model, Document } from "mongoose";
import { CompanyStatus, TeamRole } from '@/shared/types/company'
interface CompanyVerificationDoc {
  documentType: string;
  documentUrl: string;
  uploadedAt: Date;
}
interface OwnerVerificationDoc {
  documentType: string;
  documentUrl: string;
  uploadedAt: Date;
}
interface TeamMember {
  userId: mongoose.Types.ObjectId;
}
interface LocationPoint {
  placename: string;
  type: "Point";
  coordinates: number[];
}

interface StatusHistoryEntry {
  status: string;
  updatedAt: Date;
}

export interface CompanyAttrs {
  name: string;
  website?: string;
  industry?: string;  
  type?: string;
  size?: string;
  headquarters?: LocationPoint;
  location: LocationPoint[];  
  foundedDate?: Date;
  techStack?: string[];
  description?: string;
  linkedInUrl?: string;
  logo?: string;
  team?: TeamMember[];
  owner: mongoose.Types.ObjectId;
  verified?: boolean;
  companyVerificationDoc?: CompanyVerificationDoc;
  ownerVerificationDoc?: OwnerVerificationDoc;
  verifiedAt?: Date;
  reUploadDocLimit?: number;
  status?: CompanyStatus;
  statusHistory?: StatusHistoryEntry[];
}

export interface CompanyDoc extends Document {
  name: string;
  website?: string;
  industry: string; 
  type?: string;
  size?: string;
  headquarters?: LocationPoint;
  location: LocationPoint[];
  foundedDate?: Date;
  techStack?: string[];
  description?: string;
  linkedInUrl?: string;
  logo?: string;
  team?: TeamMember[];
  verified: boolean;  
  companyVerificationDoc?: CompanyVerificationDoc;
  ownerVerificationDoc?: OwnerVerificationDoc;
  verifiedAt?: Date;
  reUploadDocLimit: number; 
  status: CompanyStatus; 
  statusHistory?: StatusHistoryEntry[];
  owner: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface PopulatedCompanyDoc
  extends Omit<CompanyDoc, "owner" | "team"> {
  owner: {
    _id: mongoose.Types.ObjectId;
  };
  team?: {
    userId: {
      _id: mongoose.Types.ObjectId;
    };
    role: TeamRole;
  }[];
}

export interface CompanyModel extends Model<CompanyDoc> {
  build(attrs: CompanyAttrs): CompanyDoc;
}

export interface UpdateCompanyAttrs extends Partial<CompanyAttrs> {
  verified?: boolean;
  companyVerificationDoc?: CompanyVerificationDoc;
  ownerVerificationDoc?: OwnerVerificationDoc;
  verifiedAt?: Date;
  reUploadDocLimit?: number;
  status?: CompanyStatus;
  statusHistory?: StatusHistoryEntry[];
}

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, "Company name already exists"],
      required: [true, "Company name is required"],
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
        enum: ["Point"],
        default: "Point",
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
            enum: ["Point"],
            default: "Point",
          },
          coordinates: {
            type: [Number],
          },
        },
      ],
      required: [true, "location needed"],
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

    linkedInUrl: {
      type: String,
    },

    logo: {
      type: String,
      required: false,
    },

    team: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        }
      },
    ],

    verified: {
      type: Boolean,
      default: false,
    },

    companyVerificationDoc: {
      documentType: String,
      documentUrl: String,
      uploadedAt: Date,
    },

    ownerVerificationDoc: {
      documentType: String,
      documentUrl: String,
      uploadedAt: Date,
    },

    verifiedAt: {
      type: Date,
    },

    reUploadDocLimit: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: CompanyStatus,
      default: CompanyStatus.Pending,
    },

    statusHistory: [
      {
        status: String,
        updatedAt: Date, 
     }
    ],

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner name is required"],
    },
  },
  { timestamps: true }
);

companySchema.statics.build = (attrs: CompanyAttrs) => {
  return new Company(attrs);
};

const Company = mongoose.model<CompanyDoc, CompanyModel>(
  "Company",
  companySchema
);

export default Company;
