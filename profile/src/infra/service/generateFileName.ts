import crypto from 'crypto';


export const generateFileName = (bytes = 32) => {
   return crypto.randomBytes(bytes).toString("hex") 
}