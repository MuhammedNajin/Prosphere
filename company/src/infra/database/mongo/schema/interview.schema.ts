import mongoose, { Model, Document } from "mongoose";

export const INTERVIEW_TYPES = [
  "technical",
  "behavioral",
  "system_design",
  "cultural_fit",
  "final",
] as const;

export const INTERVIEW_STATUSES = [
  "scheduled",
  "in_progress",
  "completed",
  "cancelled",
  "no_show",
  "rescheduled",
] as const;

export interface InterviewAttrs {
  candidate: string;
  interviewer: string;
  scheduledStartTime: Date;
  scheduledEndTime: Date;
  interviewType: typeof INTERVIEW_TYPES[number];
  location: {
    type: "online" | "office";
    link?: string;
    address?: string;
    room?: string;
  };
  position: string;
  department: string;
  round: number;
  notes?: string;
}

export interface InterviewDoc extends Document {
  candidate: mongoose.Types.ObjectId;
  interviewer: mongoose.Types.ObjectId;
  scheduledStartTime: Date;
  scheduledEndTime: Date;
  actualStartTime: Date | null;
  actualEndTime: Date | null;
  interviewType: typeof INTERVIEW_TYPES[number];
  location: {
    type: "online" | "office";
    link: string | null;
    address: string | null;
    room: string | null;
  };
  position: mongoose.Types.ObjectId;
  department: mongoose.Types.ObjectId;
  round: number;
  status: typeof INTERVIEW_STATUSES[number];
  feedback: {
    rating: number | null;
    strengths: string[];
    weaknesses: string[];
    notes: string | null;
    recommendation: "strong_hire" | "hire" | "no_hire" | "strong_no_hire" | null;
    submittedAt: Date | null;
  };
  notes: string | null;
  statusHistory: Array<{
    status: typeof INTERVIEW_STATUSES[number];
    updatedBy: mongoose.Types.ObjectId;
    updatedAt: Date;
    reason?: string;
  }>;
  cancellation: {
    reason: string | null;
    cancelledBy: mongoose.Types.ObjectId | null;
    cancelledAt: Date | null;
  };
  notifications: Array<{
    type: "reminder" | "cancellation" | "rescheduling" | "feedback_required";
    sentTo: mongoose.Types.ObjectId;
    sentAt: Date;
    status: "sent" | "delivered" | "read";
  }>;
}

export interface InterviewModel extends Model<InterviewDoc> {
  build(attrs: InterviewAttrs): InterviewDoc;
}

const InterviewSchema = new mongoose.Schema<InterviewDoc, InterviewModel>(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: [true, "Candidate is required"],
    },

    interviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Interviewer is required"],
    },

    scheduledStartTime: {
      type: Date,
      required: [true, "Start time is required"],
    },

    scheduledEndTime: {
      type: Date,
      required: [true, "End time is required"],
    },

    actualStartTime: {
      type: Date,
      default: null,
    },

    actualEndTime: {
      type: Date,
      default: null,
    },

    interviewType: {
      type: String,
      enum: INTERVIEW_TYPES,
      required: [true, "Interview type is required"],
    },

    location: {
      type: {
        type: String,
        enum: ["online", "office"],
        required: [true, "Location type is required"],
      },
      link: {
        type: String,
        default: null,
      },
      address: {
        type: String,
        default: null,
      },
      room: {
        type: String,
        default: null,
      },
    },

    position: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Position",
      required: [true, "Position is required"],
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: [true, "Department is required"],
    },

    round: {
      type: Number,
      required: [true, "Interview round is required"],
      min: 1,
    },

    status: {
      type: String,
      enum: INTERVIEW_STATUSES,
      default: "scheduled",
    },

    feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
        default: null,
      },
      strengths: {
        type: [String],
        default: [],
      },
      weaknesses: {
        type: [String],
        default: [],
      },
      notes: {
        type: String,
        default: null,
      },
      recommendation: {
        type: String,
        enum: ["strong_hire", "hire", "no_hire", "strong_no_hire", null],
        default: null,
      },
      submittedAt: {
        type: Date,
        default: null,
      },
    },

    notes: {
      type: String,
      default: null,
    },

    statusHistory: [
      {
        status: {
          type: String,
          enum: INTERVIEW_STATUSES,
          required: true,
        },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
        reason: {
          type: String,
        },
      },
    ],

    cancellation: {
      reason: {
        type: String,
        default: null,
      },
      cancelledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
      cancelledAt: {
        type: Date,
        default: null,
      },
    },

    notifications: [
      {
        type: {
          type: String,
          enum: ["reminder", "cancellation", "rescheduling", "feedback_required"],
          required: true,
        },
        sentTo: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        sentAt: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ["sent", "delivered", "read"],
          default: "sent",
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = doc._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

InterviewSchema.statics.build = (attrs: InterviewAttrs) => {
  return new Interview(attrs);
};

const Interview = mongoose.model<InterviewDoc, InterviewModel>(
  "Interview",
  InterviewSchema
);

export default Interview;