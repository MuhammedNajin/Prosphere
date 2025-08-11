import { IUser } from "@domain/entities/interfaces";
import Password from "@/infrastructure/libs/password";
import { Auth } from "../../database";
import { BadRequestError, NotAuthorizedError, RequestValidationError } from "@muhammednajinnprosphere/common";

export default {
  getUser: async (user: any) => {
    const userDetials = await Auth.findOne({ email: user.email });

    const phone = await Auth.findOne({ phone: user.phone });
    console.log("phone", phone, user.phone)
    if(phone) {
       throw new BadRequestError("Phone already exist's")
    }
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
        existingUser.password
      );

      if(existingUser.isBlocked) {
         throw new NotAuthorizedError('Your accont is blocked by admin, please contact support');
      }

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

  async forgetPassword({ email, token }: { email: string; token: string }) {
    try {
      const user = await Auth.findOne({ email: email });
      console.log("user", user);

      if (!user) {
        return false;
      }
      const now = Date.now(); 
      const oneHourLater = now + 60 * 60 * 1000;
      user.forgetPasswordToken = token;
      user.forgetPasswordTokenExpireAt = oneHourLater;
      return await user.save();
    } catch (error) {
      console.log(error);
    }
  },

  async resetPassword({
    token,
    password,
  }: {
    token: string;
    password: string;
  }) {
    
      const user = await Auth.findOne({
        forgetPasswordToken: token,
        forgetPasswordTokenExpireAt: { $gt: Date.now() },
      });

      if (user) {
        user.password = password;
        user.forgetPasswordTokenExpireAt = Date.now();
        return await user.save();
      }
      return false;
  },

  async adminLogin({ email, password }: Pick<IUser, "email" | "password">) {
    const admin = await Auth.findOne({ email });

    if (!admin) {
      return false;
    }

    if (admin.password !== password) {
      return false;
    }

    return true;
  },

  async fetchUsers() {
    const users = await Auth.find();
    return users;
  },

  async blockUser(_id: string) {
    const user = await Auth.findOne({ _id });
    console.log("user ", user);

    if (!user) {
      return false;
    }

    user.isBlocked = !user.isBlocked;
    await user.save();
    return true;
  },

  async googleAuth({ email, username }: Pick<IUser, "email" | "username">) {
    console.log(email, username);

    const exist = await Auth.findOne({ email });
    if (exist) {
      return { status: "exist", user: exist };
    }

    const user = Auth.build({
      email: email,
      username: username,
      authType: "google",
    });

    await user.save();
    return { status: "new", user };
  },

  async googleAuthFlow({
    phone,
    jobRole,
    email,
  }: Pick<IUser, "phone" | "jobRole" | "email">) {
    const user = await Auth.findOne({ email });
    if (!user) {
      return false;
    }
    user.phone = phone;
    user.jobRole = jobRole;
    await user.save();
    return user;
  },

  async changePassword(oldPassword: string , newPassword: string, _id: string) {
     try {
         const user = await Auth.findOne({ _id });

         if(!user) {
           throw new BadRequestError("No such user find!!!!");
         }

         const compare = await Password.compare(oldPassword, user.password)

         if(!compare) {
             throw new BadRequestError("The old password you entered is incorrect.")
         }

         user.password = newPassword;

         await user.save();
         
     } catch (error) {
       console.log("error", error);
       throw error;
     }
  }
};
