export interface UserData {
     _id: string;
     email: string;
     username: string;
     phone: string;
     jobRole: string;
     isBlocked: boolean;
     createdAt: string;
} 

export interface IOtp {
    email: string;
    otp: string;
  }

export interface googleSignUpFlow {
    phone: string;
    jobRole: string;
    email: string;
  }

export interface adminLogin {
    email: string;
    password: string;
  }

export interface SignInResponse {
  userCredential: UserData;
  resumeKey: string[];
}  