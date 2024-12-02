
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

  
export enum MESSAGE_STATUS {
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
}