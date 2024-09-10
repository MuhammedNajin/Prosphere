import { Mail } from "../../libs/entities/interfaces";
import {
  mailGenerator,
  getMessage,
  generatePasswordResetEmail,
  generateOTPEmail,
} from "../../libs/utils/genarateMail";


export const sentMailUseCase = (depedencies: any) => {
  const {
    service: { transporter },
  } = depedencies;

  const execute = async (message: Mail) => {
    try {
      const info = await transporter.sendMail(message);
      return info;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  return { execute };
};
