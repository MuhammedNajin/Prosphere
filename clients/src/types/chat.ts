
export interface MessageAttrs {
    conversation: string;
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


 export interface selectedConversation {
     receiverId: string,
     id: string,
     name: string,
     avatar: string,
     context: ROLE,
     company: {
       id: string,
       name: string, 
       onwer: string,
  
     }
     newConv: boolean;
  }
 export interface Message {
    id: string;
    conversation: string;
    sender: string;
    content: {
      type: "text" | "image" | "file" | "audio";
      text?: string;
      fileUrl?: string;
      fileName?: string;
      fileSize?: number;
      mimeType?: string;
    };
    context: ROLE
    newConv?: boolean;
    status: MESSAGE_STATUS;
    replyTo?: string;
  }

  export interface Conversation {
    id: string;
    type: "direct" | "group";
    participants: string[];
    lastMessage?: Message;
    admins?: string[];
    context?: ROLE;
    
    muted?: Array<{
      user: string;
      mutedUntil: Date | null;
    }>;
    unreadCount: number;
    pinnedBy?: string[];
    updatedAt: string;
  }

export interface ChatRole {
   context: ROLE;
}  

  
export enum MESSAGE_STATUS {
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
}

export enum ROLE {
   USER = 'user',
   COMPANY = 'company'
}