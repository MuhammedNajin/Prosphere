export interface SendOtpMailProps {
    email: string;
    name: string;
    otp: string;
  }
  
  export interface SendPasswordResetLinkProps {
    email: string;
    name: string;
    resetLink: string;
  }
  
  export interface IMailService {
    sendOtpMail(props: SendOtpMailProps): Promise<void>;
    sendPasswordResetLink(props: SendPasswordResetLinkProps): Promise<void>;
  }