export {}

interface User {
    id: string;
    username: string;
    email: string;
    role: string
    
  }
 
declare global {
    namespace Express {
      interface Request {
        currentUser?: User;
        currentAdmin?: User;
      }
    }
  }