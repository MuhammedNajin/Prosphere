import mongoose, { Document } from "mongoose";
import { NotificationType } from "@muhammednajinnprosphere/common";

export interface NotificationAttrs {
    recipient: string;
    type: NotificationType;
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
    recipient: String;
    type: NotificationType;
    title: string;
    message: string;
    data: {
      jobId?: mongoose.Types.ObjectId;
      applicationId?: mongoose.Types.ObjectId;
      messageId?: mongoose.Types.ObjectId;
      employerId?: mongoose.Types.ObjectId;
    };
    context: string;
    companyId: mongoose.Types.ObjectId;
    status: "unread" | "read" | "archived";
    actionUrl: string | null;
    readAt: Date | null;
    archivedAt: Date | null;
    isDeleted: boolean;
    deletedAt: Date | null;
  }