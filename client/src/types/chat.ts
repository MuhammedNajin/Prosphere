
export interface MessageAttrs {
    id: string
    conversationId: string;
    sender: string;
    receiver: string;
    content: {
      type: "text" | "image" | "file" | "audio";
      text?: string;
      fileUrl?: string;
      fileName?: string;
      fileSize?: number;
      mimeType?: string;
    };
    replyTo?: string;
    context: ROLE;
    companyId: string;
  }


 export interface SelectedConversation {
     receiverId: string,
     id: string,
     name: string,
     avatar: string,
     context: ROLE,
     company: {
       id: string,
       name: string, 
       owner: string,
  
     }
     lastSeen: Date;
     newConv?: boolean;
     participant: {
        _id: string;
        username: string;
        avatar: string;
        context: ROLE;
     }
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
    receiverDetails: {
      _id: string;
      username: string;
      avatar: string;
      context: ROLE;
      lastSeen: Date
    },
    company: {
      id: string,
      name: string, 
      owner: string,
    };
    context: ROLE
    newConv?: boolean;
    status: MESSAGE_STATUS;
    replyTo?: string;
    companyId: string;
  }

  export interface Participants {
    _id: string;
    username: string;
    avatar: string;
    context: ROLE;
    lastSeen: Date;
  }

  export interface Conversation {
    id: string;
    type: "direct" | "group";
    participants: Participants[];
    lastMessage?: Message;
    admins?: string[];
    context: ROLE;
    company: {
      id: string,
      name: string, 
      owner: string,
    }
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

export interface AvatarUrls {
  [key: string]: string; 
}