

export enum ROLE  {
   USER = 'user',
   ADMIN = 'admin',
   COMPANY = 'company'
}

export enum URL {
   JobPost = "/api/v1/job/company/jobs"
}

export enum UsageMetrics {
   JobPostsUsed = "jobPostsUsed",
   VideoCallsUsed = "videoCallsUsed",
   MessagesUsed = "messagesUsed",
 }

 export enum Trail_Status {
    TRUE = 'true',
    False = 'false',
 }

 export enum Feature_Limit {
   Job_Post_Limit = 'jobPostLimit',
   Video_Call_Limit = 'videoCallLimit',
   Message_Limit = 'messageLimit'
 }