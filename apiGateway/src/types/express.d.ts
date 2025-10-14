import { CompanyPayload, Payload } from "../interface";
export {}

declare global {
  namespace Express {
    interface Request {
      currentUser?: Payload;
      currentAdmin?: Payload;
      currentCompany?: CompanyPayload;
    }
  }
}

