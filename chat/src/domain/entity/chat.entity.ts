import { MessageProps } from "../interface/IChat";
  
  export class Message {
    private conversation: string;
    private sender: string;
    private content: {
      type: "text" | "image" | "file" | "audio";
      text?: string;
      fileUrl?: string;
      fileName?: string;
      fileSize?: number;
      mimeType?: string;
    };
    private replyTo?: string;
  
    constructor(props: MessageProps) {
      this.conversation = props.conversation;
      this.sender = props.sender;
      this.content = props.content;
      this.replyTo = props.replyTo;
    }
  
 
    getConversation(): string {
      return this.conversation;
    }
  
    getSender(): string {
      return this.sender;
    }
  
    getContent(): MessageProps['content'] {
      return this.content;
    }
  
    getReplyTo(): string | undefined {
      return this.replyTo;
    }
  
    setConversation(conversation: string): void {
      this.conversation = conversation;
    }
  
    setSender(sender: string): void {
      this.sender = sender;
    }
  
    setContent(content: MessageProps['content']): void {
      this.content = content;
    }
  
    setReplyTo(replyTo: string): void {
      this.replyTo = replyTo;
    }
  
    public toDTO(): MessageProps {
      return Object.freeze({
        conversation: this.conversation,
        sender: this.sender,
        content: Object.freeze({
          type: this.content.type,
          text: this.content.text,
          fileUrl: this.content.fileUrl,
          fileName: this.content.fileName,
          fileSize: this.content.fileSize,
          mimeType: this.content.mimeType
        }),
        replyTo: this.replyTo
      });
    }

  }