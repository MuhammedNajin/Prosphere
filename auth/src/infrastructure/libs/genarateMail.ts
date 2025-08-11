import Mailgen from "mailgen";
import 'dotenv/config'


export const mailGenerator = new Mailgen({
    theme: 'default',
    product: {
        // Appears in header & footer of e-mails
        name: 'ProSphere',
        link: 'http://localhost:5173',
        logo: ''
    }
});


interface EmailBody {
    name: string,
    intro: string,
    outro: string,
}

export const generate = ({ name, intro, outro }: EmailBody) => {

    const email = {
        body: {
            name: 'John Appleseed',
            intro: 'Welcome to Mailgen! We\'re very excited to have you on board.',
            action: {
                instructions: 'To get started with Mailgen, please click here:',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'Confirm your account',
                    link: 'https://mailgen.js/confirm?s=d9729feb74992cc3482b350163a1a010'
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    }

    return mailGenerator.generate(email);
    
}



export function generatePasswordResetEmail(userName: string, resetLink: string): string {
    const email = {
        body: {
            name: userName,
            intro: 'You have requested a password reset for your account.',
            action: {
                instructions: 'Click the button below to reset your password:',
                button: {
                    color: '#22BC66', // Optional, defaults to #22BC66
                    text: 'Reset Your Password',
                    link: resetLink
                }
            },
            outro: "If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.",
            signature: 'Best regards'
        }
    };

    return mailGenerator.generate(email);
}



export function generateOTPEmail(username: string, otp: string, expirationTime: string) {
    // Prepare email contents
    const email = {
        body: {
            name: username,
            intro: 'You have requested a one-time password (OTP) for account verification.',
            action: {
                instructions: 'Please use the following OTP to complete your action:',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: otp,
                    link: '#' // Since it's an OTP, we don't need a real link
                }
            },
            outro: `This OTP will expire in ${expirationTime}. If you did not request this OTP, please ignore this email or contact support if you have concerns.`
        }
    };

    // Generate an HTML email with the provided contents
    const emailBody = mailGenerator.generate(email);

    return emailBody;
}


export const getMessage = ({
    userEmail,
    subject,
    mail,
  }: {
    userEmail: string;
    subject: string;
    mail: any;
  }) => {
    
    let message = {
      from: process.env.SENDER_MAIL,
      to: userEmail,
      subject: subject,
      html: mail,
    };
    return message;
  };