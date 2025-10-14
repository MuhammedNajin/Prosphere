import mongoose, { Model, Document, Schema } from "mongoose";
import { CompanyStatus, TeamRole } from "@/shared/constance";
import { ILocationPoint } from "@/shared/types/shared-types";
import { 
  CompanyType,
  CompanySize,
  ICompany
} from "@/domain/interface/ICompany";

export interface CompanyDoc extends ICompany, Document {
  id: string;
}

export interface PopulatedCompanyDoc extends Omit<CompanyDoc, "owner" | "team"> {
  owner: {
    _id: string;
  };
  team?: {
    userId: {
      _id: string;
    };
    role: TeamRole;
    isActive: boolean;
    joinedAt: Date;
  }[];
}

export interface CompanyModel extends Model<CompanyDoc> {
  build(attrs: Partial<CompanyDoc>): CompanyDoc;
  generateId(): string;
}

const companySchema = new Schema<CompanyDoc, CompanyModel>(
  {
    name: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
    },
    website: {
      type: String,
      trim: true,
    },
    industry: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: Object.values(CompanyType || {}),
    },
    size: {
      type: String,
      enum: Object.values(CompanySize || {}),
    },

    // Location Information
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
    locations: {
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
      required: [true, "At least one location is required"],
      validate: {
        validator: (arr: ILocationPoint[]) => arr.length > 0,
        message: "At least one location is required",
      },
    },

    // Company Details
    foundedDate: {
      type: Date,
    },
    techStack: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      trim: true,
    },
    mission: {
      type: String,
      trim: true,
    },
    vision: {
      type: String,
      trim: true,
    },
    values: {
      type: [String],
      default: [],
    },

    // Media & Branding
    logo: {
      type: String,
      trim: true,
    },
    coverImage: {
      type: String,
      trim: true,
    },
    gallery: {
      type: [String],
      default: [],
    },

    // Social & Contact
    socialLinks: {
      linkedin: String,
      twitter: String,
      facebook: String,
      instagram: String,
      github: String,
      youtube: String,
    },
    contact: {
      email: String,
      phone: String,
      address: String,
    },

    // Team Management
    team: {
      type: [
        {
          userId: {
            type: String,
            ref: "User",
            required: true,
          },
          role: {
            type: String,
            enum: Object.values(TeamRole),
            required: true,
          },
          isActive: {
            type: Boolean,
            default: true,
          },
          joinedAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
    },
    owner: {
      type: String,
      ref: "User",
      required: [true, "Owner is required"],
    },

    // Verification & Documents - CHANGED TO SINGLE DOCUMENTS
    verified: {
      type: Boolean,
      default: false,
    },
    companyVerificationDoc: {
      documentType: {
        type: String,
        required: false, // Optional since document might not be uploaded initially
      },
      documentUrl: {
        type: String,
        required: false, // Optional since document might not be uploaded initially
      },
      uploadedAt: {
        type: Date,
      },
    },
    ownerVerificationDoc: {
      documentType: {
        type: String,
        required: false, // Optional since document might not be uploaded initially
      },
      documentUrl: {
        type: String,
        required: false, // Optional since document might not be uploaded initially
      },
      uploadedAt: {
        type: Date,
      },
    },
    verifiedAt: {
      type: Date,
    },
    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reUploadDocLimit: {
      type: Number,
      default: 3,
    },
  
    status: {
      type: String,
      enum: Object.values(CompanyStatus),
      default: CompanyStatus.PENDING,
    },

    statusHistory: {
      type: [
        {
          id: {
            type: String,
          },
          status: {
            type: String,
            enum: Object.values(CompanyStatus),
            required: true,
          },
          previousStatus: {
            type: String,
            enum: Object.values(CompanyStatus),
          },
          reason: String,
          updatedAt: {
            type: Date,
            default: Date.now,
          },
          updatedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
          },
        },
      ],
      default: [],
    },

    // SEO & Discovery
    tags: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },

    // Analytics & Metrics
    viewCount: {
      type: Number,
      default: 0,
    },
    followerCount: {
      type: Number,
      default: 0,
    },

    // Soft Delete
    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

// Indexes for better performance
companySchema.index({ name: 1 });
companySchema.index({ slug: 1 });
companySchema.index({ owner: 1 });
companySchema.index({ status: 1 });
companySchema.index({ featured: 1 });
companySchema.index({ verified: 1 });
companySchema.index({ industry: 1 });
companySchema.index({ deletedAt: 1 });
companySchema.index({ "locations.coordinates": "2dsphere" }); // For geospatial queries
companySchema.index({ tags: 1 });

// Pre-save middleware to generate slug
companySchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

// Static method to build new documents
companySchema.statics.build = (attrs: Partial<CompanyDoc>) => {
  return new CompanyModel(attrs);
};

// Static method to generate IDs (similar to domain logic)
companySchema.statics.generateId = () => {
  return new mongoose.Types.ObjectId().toHexString();
};

companySchema.methods.isActive = function() {
  return this.status === CompanyStatus.ACTIVE && !this.deletedAt;
};

export const CompanyModel = mongoose.model<CompanyDoc, CompanyModel>("Company", companySchema);