import otpGenerator from 'otp-generator';

class OTP {
    constructor() {}

    static generate(length: number) {
        const otp = otpGenerator.generate(length, { upperCaseAlphabets: false, specialChars: false, digits: true, lowerCaseAlphabets: false });
        return otp;
    }

}

export default OTP;