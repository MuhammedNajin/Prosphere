import { ROLE } from "./chat";

export enum NotificationType {
    NewJob = "job",
    InterviewInvite = "interview_invite",
    ProfileView = "profile_view",
    Message = "message",
    application = "application"
}

export interface NotificationAttrs {
    id: string
    recipient: string;
    type: NotificationType;
    title: string;
    message: string;
    context: ROLE,
    companyId: string | null
    data?: {
      jobId?: string;
      applicationId?: string;
      messageId?: string;
      employerId?: string;
    };
    actionUrl?: string;
    status: string
    createdAt: string
  }