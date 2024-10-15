
import { IOtp } from "@domain/entities/interfaces";



export const verifyOtpUseCase = (dependecies: any) => {
     
    const {
        repository: { otpRepository }
    } = dependecies;

    const execute = async ({ otp, userId }: IOtp) => {
       return otpRepository.verifyOtp({otp, userId});
    }

    return {
        execute
    }
}