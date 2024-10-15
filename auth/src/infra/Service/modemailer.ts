import nodemailer from 'nodemailer';
import 'dotenv/config';

console.log("process pass", process.env.PASS, "sender" ,process.env.SENDER_MAIL);

export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SENDER_MAIL,
      pass: process.env.PASS,
    },
  });