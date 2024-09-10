import jwt from 'jsonwebtoken';
import { TokenData } from '../entities/interfaces';
import { v4 as uuidv4 } from 'uuid';
import { OAuth2Client } from 'google-auth-library';

class Token {
  static  generateJwtToken(payload: TokenData) {
      const secrect = process.env.TOKEN_SECRECT as string
       const token = jwt.sign(payload, secrect, {
          expiresIn: "1h"
       } )
       return token
  }

  static generateForgetPasswordToken() {
      const token = uuidv4();
      console.log(token);
      return token;
  }

  static async verifyGoogleAuth(token: string) {
    const client = new OAuth2Client();
     const verify = await  client.verifyIdToken({
       idToken: token,
       audience: '884141115056-o3pkeqli515ugoohn2qbpqasc723q90p.apps.googleusercontent.com'
     })
     console.log(verify)
     return verify.getPayload()
  }

  static decode(token: string) {
      const decoded = jwt.decode(token)
      return decoded;
  }
}

export default Token;