import { injectable } from "inversify";
import nodemailer, { Transporter } from "nodemailer";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import "dotenv/config";
import { IMailService, SendOtpMailProps, SendPasswordResetLinkProps } from "../interface/service/IMailService";
import { getEnvs } from "@muhammednajinnprosphere/common";

const {
  SMTP_HOST,
  SMTP_PORT,
  SENDER_MAIL,
  PASS,
  COMPANY_NAME,
  COMPANY_DOMAIN,
} = getEnvs(
  "SMTP_HOST",
  "SMTP_PORT",
  "SENDER_MAIL",
  "PASS",
  "COMPANY_NAME",
  "COMPANY_DOMAIN"
);

const readFileAsync = promisify(fs.readFile);

@injectable()
export class MailService implements IMailService {
  constructor() {
    // Use extracted variables instead of process.env
    if (!COMPANY_NAME || !COMPANY_DOMAIN || !SENDER_MAIL || !PASS) {
      throw new Error("Server configuration error: Missing required environment variables");
    }
  }

  private async loadTemplate(filePath: string): Promise<string> {
    try {
      // Use extracted TEMPLATE_PATH variable
      const templateBasePath = path.resolve(__dirname, "../../../public");
      const fullPath = path.join(templateBasePath, filePath);
      return await readFileAsync(fullPath, "utf-8");
    } catch (error) {
      console.error(`Failed to load template at ${filePath}:`, error);
      throw new Error(`Could not load email template: ${filePath}`);
    }
  }

  private getTransporter(): Transporter {
    // Use extracted SMTP variables
    const smtpHost = SMTP_HOST || "smtp.gmail.com";
    const smtpPort = parseInt(SMTP_PORT || "587", 10);

    return nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: false,
      auth: {
        user: SENDER_MAIL, // Use extracted variable
        pass: PASS,        // Use extracted variable
      },
    });
  }

  private async send(to: string, subject: string, html: string): Promise<void> {
    try {
      const transporter = this.getTransporter();
      await transporter.sendMail({
        from: SENDER_MAIL, // Use extracted variable
        to,
        subject,
        html,
      });
    } catch (error) {
      console.error(`Failed to send email to ${to}:`, error);
      throw new Error("Failed to send email");
    }
  }

  async sendOtpMail({ email, name, otp }: SendOtpMailProps): Promise<void> {
    const subject = "Account Verification";

    let html = await this.loadTemplate("otpEmailTemplate.html");
    html = html
      .replace(/{{name}}/g, name)
      .replace(/{{otp}}/g, otp)
      .replace(/{{CompanyName}}/g, COMPANY_NAME || "") // Use extracted variable
      .replace(/{{CompanyDomain}}/g, COMPANY_DOMAIN || "") // Use extracted variable
      .replace(/{{type}}/g, subject)
      .replace(/{{subject}}/g, subject);

    await this.send(email, subject, html);
  }

  async sendPasswordResetLink({ email, name, resetLink }: SendPasswordResetLinkProps): Promise<void> {
    const subject = "Password Reset";

    let html = await this.loadTemplate("passwordResetLinkTemplate.html");
    html = html
      .replace(/{{name}}/g, name)
      .replace(/{{resetLink}}/g, resetLink)
      .replace(/{{CompanyName}}/g, COMPANY_NAME || "") // Use extracted variable
      .replace(/{{CompanyDomain}}/g, COMPANY_DOMAIN || "") // Use extracted variable
      .replace(/{{subject}}/g, subject);

    await this.send(email, subject, html);
  }
}