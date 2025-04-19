export interface MessageProps {
  _id: string
  conversation: string;
  receiver: string;
  sender: string;
  content: {
    type: "text" | "image" | "file" | "audio";
    text?: string;
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