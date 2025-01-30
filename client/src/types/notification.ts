import { Bell, Briefcase, MessageSquare, Star } from "lucide-react";
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

  export const FILTER_TABS = [
    { value: 'all', label: 'All', icon: Bell },
    { value: 'application', label: 'Applications', icon: Briefcase },
    { value: 'message', label: 'Messages', icon: MessageSquare },
    { value: 'job', label: 'Jobs', icon: Star },
  ] as const;
  
  

  export type FilterType = typeof FILTER_TABS[number]['value'];