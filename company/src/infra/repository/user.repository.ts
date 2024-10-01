import { User } from "../database/mongo";
import { UserEntity } from "../../domain";
import { IUser } from "../../application/interface";

export default {

  createUser: async (user: IUser) => {
    const profile = new UserEntity(user);
    console.log("profile", profile);
    return await User.build(profile).save();
  }, 

};
