import { Mail } from "@domain/entities/interfaces";
import {
  mailGenerator,
  getMessage,
  generatePasswordResetEmail,
  generateOTPEmail,
} from "@infra/libs/genarateMail";


export const sentMailUseCase = (depedencies: any) => {
  const {
    service: { transporter },
  } = depedencies;

  const execute = async (message: Mail) => {
    try {

      return await transporter.sendMail(message);
    
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  return { execute };
};
