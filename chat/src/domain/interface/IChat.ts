export interface MessageProps {
  conversation: string;
  sender: string;
  content: {
    type: "text" | "image" | "file" | "audio";
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
  };
  replyTo?: string;
}

export interface ConversationProps {
  type: 'direct' | 'group';
  participants: string[];
  lastMessage?: string;
  name?: string;
  avatar?: string;
  admins?: string[];
}