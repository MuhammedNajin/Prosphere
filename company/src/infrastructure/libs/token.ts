import jwt from "jsonwebtoken";



export function generateCompanyAccessToken(payload: object) {
    const secret =  process.env.COMPANY_ACCESS_SECRET!
    return jwt.sign(payload, secret, { expiresIn: '4h' });
  }