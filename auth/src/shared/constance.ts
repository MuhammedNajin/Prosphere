
export enum AuthProvider {
    DEFAULT = "default",
    GOOGLE = "google",
    GITHUB = "github",
  }
  
  export enum UserRole {
    USER = "user",
    ADMIN = "admin",
  }
  
  export enum EmploymentType {
    FULL_TIME = "Full-time",
    PART_TIME = "Part-time",
    CONTRACT = "Contract",
    INTERNSHIP = "Internship",
    FREELANCE = "Freelance",
  }
  
  export enum LocationType {
    ON_SITE = "On-site",
    REMOTE = "Remote",
    HYBRID = "Hybrid",
  }
  
  export enum SkillProficiency {
      BEGINNER = "Beginner",
      INTERMEDIATE = "Intermediate",
      ADVANCED = "Advanced",
      EXPERT = "Expert"
  }
  
export enum NodeEnv {
    DEVELOPMENT = 'development',
    PRODUCTION = 'production',
    TEST = 'test',
  }

export enum ErrorCode {
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  TOKEN_REQUIRED = 'TOKEN_REQUIRED',
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  USERNAME_ALREADY_EXISTS = 'USERNAME_ALREADY_EXISTS',
  INVALID_EMAIL = 'INVALID_EMAIL',
  INVALID_USERNAME = 'INVALID_USERNAME',
  INVALID_PASSWORD = 'INVALID_PASSWORD',
  INVALID_OTP = 'INVALID_OTP',
  INVALID_TOKEN = 'INVALID_TOKEN',
  INVALID_REFRESH_TOKEN = 'INVALID_REFRESH_TOKEN',
  INVALID_ACCESS_TOKEN = 'INVALID_ACCESS_TOKEN',
  USER_BLOCKED = 'USER_BLOCKED',
  INVALID_GOOGLE_TOKEN = 'INVALID_GOOGLE_TOKEN',
  GOOGLE_AUTH_DATA_MISSING = 'GOOGLE_AUTH_DATA_MISSING',
}