import { IUser } from "../../libs/entities/interfaces";
import Password from "../../libs/utils/password";
import { Auth } from "../database";

export default {
  getUser: async (user: any) => {
    const userDetials = await Auth.findOne({ email: user.email });
    return userDetials;
  },

  signUp: async (attrs: any) => {
    console.log("signup ", attrs);

    const mongooseObject = Auth.build(attrs);
    return await mongooseObject.save();
  },

  login: async (user: any) => {
    const existingUser = await Auth.findOne({ email: user.email });
     console.log("existingUser", existingUser);
     
    if (existingUser) {
      const passwordMatches = await Password.compare(
        user.password,
        existingUser.password,
      );

      console.log("passwordMatches", passwordMatches);
      

      if (passwordMatches) {
        return existingUser;
      } else {
        return false;
      }
    } else {
      return false;
    }
  },

  async verifyUser(userId: string) {
    try {
      const user = await Auth.findOne({ _id: userId });

      if (!user) return false;

      user.verified = true;
      return await user?.save();
    } catch (error) {
      console.log(error);
    }
  },

  async forgetPassword({ email, token }: { email: string, token: string }) {
      try {
         const user = await Auth.findOne({email: email});
         if(!user) {
           throw new Error("[forgot password]: user not found");
         }
         user.forgetPasswordToken = token
         user.forgetPasswordTokenExpireAt = Date.now();
         return await user.save()
      } catch (error) {
        console.log(error);
        
      }
  },

  async resetPassword({ token, password }: { token: string, password: string}) {
       try {
        const user = await Auth.findOne({
          forgetPasswordToken: token,
          forgetPasswordTokenExpireAt: { $gt: Date.now()}
        })

        if(user) {
           user.password = password;
          return await user.save();
        }
        return false;
       } catch (error) {
        console.log(error);
        
       }
        
  },

   async adminLogin({email, password}: Pick<IUser, "email" | "password">) {
        
         const admin =  await Auth.findOne({ email })
         
         if(!admin) {
          return false
         }

         if(admin.password !== password) {
           return false;
         }

         return true;
   },

   async fetchUsers() {
      const users = await Auth.find();
      return users;
   },

   async blockUser(email: string) {
     const user = await Auth.findOne({ email });
     if(!user) {
       return false;
     }

     user.isBlocked = !user.isBlocked;
     return true;
   },

   async googleAuth({ email, username}: Pick<IUser, 'email' | 'username'>) {
    console.log(email, username);
    
       const exist = await Auth.findOne({ email });
       if(exist) {
          return { status: 'exsist' , user: exist};
       }

       const user = Auth.build({
        email: email,
        username: username,
        authType: 'google',
      });

       await user.save();
       return { status: 'new', user};
   }
};



