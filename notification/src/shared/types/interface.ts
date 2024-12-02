import mongoose, { Document } from "mongoose";

export interface NotificationAttrs {
    recipient: string;
    type: "application_status" | "new_job" | "interview_invite" | "profile_view" | "message" | "reminder";
    title: string;
    message: string;
    data?: {
      jobId?: string;
      applicationId?: string;
      messageId?: string;
      employerId?: string;
    };
    actionUrl?: string;
  }

  export interface NotificationDoc extends Document {
    recipient: mongoose.Types.ObjectId;
    type: "application_status" | "new_job" | "interview_invite" | "profile_view" | "message" | "reminder";
    title: string;
    message: string;
    data: {
      jobId?: mongoose.Types.ObjectId;
      applicationId?: mongoose.Types.ObjectId;
      messageId?: mongoose.Types.ObjectId;
      employerId?: mongoose.Types.ObjectId;
    };
    status: "unread" | "read" | "archived";
    actionUrl: string | null;
    readAt: Date | null;
    archivedAt: Date | null;
    isDeleted: boolean;
    deletedAt: Date | null;
  }