import jwt from 'jsonwebtoken';
import { TokenData } from '../entities/interfaces';
import { v4 as uuidv4 } from 'uuid';
import { OAuth2Client } from 'google-auth-library'; 

class Token {
  static  generateJwtToken(payload: TokenData, option?: { createAdminToken: boolean } = { createAdminToken: false}) {
      const { createAdminToken: admin, } = option!
      const accessSecrect = admin ? process.env.ADMIN_SECRECT! : process.env.TOKEN_SECRECT!
      const refreshSecrect = admin ? process.env.ADMIN_REFRESH_SECRECT! : process.env.REFRESH_SECRECT!
       const accessToken = jwt.sign(payload, accessSecrect, {
          expiresIn: "1h"
       } )
       const refreshToken = jwt.sign(payload, refreshSecrect, {
        expiresIn: "2h"
       })
       return { accessToken, refreshToken }
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