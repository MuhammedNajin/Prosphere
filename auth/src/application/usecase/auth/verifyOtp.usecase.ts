
import { IOtp } from "@domain/entities/interfaces";
import { OTP_ERROR_STATE } from '@/shared/types/enums'

export const verifyOtpUseCase = (dependecies: any) => {
     
    const {
        repository: { otpRepository, redisRepository }
    } = dependecies;

    const execute = async ({ otp, email }: IOtp) => {
        console.log("usecase", email, otp);
        
       const genOtp = await redisRepository.getOtp(email)
       console.log("gen OTp ", genOtp)
       if(!genOtp) {
         return OTP_ERROR_STATE.EXPIRIED
       }

       if(otp !== genOtp) {
         return OTP_ERROR_STATE.INVALID
       } 

       return true

    }


    return {
        execute
    }
}