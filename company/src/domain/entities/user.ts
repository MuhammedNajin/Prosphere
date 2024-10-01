export class UserEntity {
    username: string;
    email: string;
    phone: string;
    jobRole: string;
    avatar: string | null;
    about: string | null;
    coverImage: string | null;
    profilePhoto: string | null;
  
    constructor({ username, email, phone, jobRole }) {
      this.username = username;
      this.email = email;
      this.phone = phone;
      this.jobRole = jobRole;
      this.avatar = null;
      this.about = null;
      this.coverImage = null;
      this.profilePhoto = null;
    }
  }
  