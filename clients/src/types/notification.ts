
export enum NotificationType {
    NewJob = "new_job",
    InterviewInvite = "interview_invite",
    ProfileView = "profile_view",
    Message = "message",
    Reminder = "reminder"
}

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
    status: string
    createdAt: string
  }