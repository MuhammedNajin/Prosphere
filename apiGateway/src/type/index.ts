
export {}

interface Payload {
  email: string;
  userName: string;
  id: string;
  role: string;
}

interface CompanyPayload {
  id: string,
  name: string
  owner: string
  verified: boolean
  status: "pending" | 'uploaded' | 'verified' | 'reject';
  role : 'owner'
}
declare global {
    namespace Express {
      interface Request {
        currentUser?: Payload;
        currentAdmin?: Payload;
        currentCompany?: CompanyPayload;
      }
    }
  }