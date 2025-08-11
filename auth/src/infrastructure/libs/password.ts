import bcrypt, { hash } from "bcrypt"

const SALT = 10
class Password {


   static async toHash(password: string) {
        try {

           const hash = await bcrypt.hash(password, SALT);
           return hash;

        } catch (error) {
            console.log(error);
            
        }
   }

   static async compare(plainText: string, hashPassword: string) {
      try {
         const compare = await bcrypt.compare(plainText, hashPassword);
         return compare;
      } catch (error) {
        console.log(error);
        return false
      }
   }
}

export default Password;