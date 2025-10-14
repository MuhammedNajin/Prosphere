import { injectable } from "inversify";
import nodemailer, { Transporter } from "nodemailer";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import { fileURLToPath } from "url";
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
    if (!COMPANY_NAME || !COMPANY_DOMAIN || !SENDER_MAIL || !PASS) {
      throw new Error("Server configuration error: Missing required environment variables");
    }
  }

  // ========================================
  // SOLUTION 1: Using import.meta.url (ES Modules)
  // ========================================
  private async loadTemplate(filePath: string): Promise<string> {
    try {
      // For ES modules, use import.meta.url
      const currentFilePath = fileURLToPath(import.meta.url);
      const currentDir = path.dirname(currentFilePath);
      const templateBasePath = path.resolve(currentDir, "../../../public");
      const fullPath = path.join(templateBasePath, filePath);
      
      console.log('Template path resolved to:', fullPath);
      
      // Check if file exists first
      if (!fs.existsSync(fullPath)) {
        console.error(`Template file does not exist at: ${fullPath}`);
        
        // List available files in the directory for debugging
        const publicDir = path.resolve(currentDir, "../../../public");
        if (fs.existsSync(publicDir)) {
          const files = fs.readdirSync(publicDir);
          console.log('Available files in public directory:', files);
        } else {
          console.error(`Public directory does not exist at: ${publicDir}`);
        }
        
        throw new Error(`Template file not found: ${filePath}`);
      }
      
      return await readFileAsync(fullPath, "utf-8");
    } catch (error) {
      console.error(`Failed to load template at ${filePath}:`, error);
      throw new Error(`Could not load email template: ${filePath}`);
    }
  }

  // ========================================
  // SOLUTION 2: Alternative using process.cwd()
  // ========================================
  private async loadTemplateAlternative(filePath: string): Promise<string> {
    try {
      // Use process.cwd() to get the project root directory
      const projectRoot = process.cwd();
      const templateBasePath = path.join(projectRoot, "public");
      const fullPath = path.join(templateBasePath, filePath);
      
      console.log('Alternative template path resolved to:', fullPath);
      
      if (!fs.existsSync(fullPath)) {
        throw new Error(`Template file not found: ${filePath}`);
      }
      
      return await readFileAsync(fullPath, "utf-8");
    } catch (error) {
      console.error(`Failed to load template at ${filePath}:`, error);
      throw new Error(`Could not load email template: ${filePath}`);
    }
  }

  // ========================================
  // SOLUTION 3: Using environment variable for template path
  // ========================================
  private async loadTemplateWithEnvPath(filePath: string): Promise<string> {
    try {
      // You can set TEMPLATE_PATH in your .env file
      const templateBasePath = process.env.TEMPLATE_PATH || path.join(process.cwd(), "public");
      const fullPath = path.join(templateBasePath, filePath);
      
      console.log('Env-based template path resolved to:', fullPath);
      
      if (!fs.existsSync(fullPath)) {
        throw new Error(`Template file not found: ${filePath}`);
      }
      
      return await readFileAsync(fullPath, "utf-8");
    } catch (error) {
      console.error(`Failed to load template at ${filePath}:`, error);
      throw new Error(`Could not load email template: ${filePath}`);
    }
  }

  private getTransporter(): Transporter {
    const smtpHost = SMTP_HOST || "smtp.gmail.com";
    const smtpPort = parseInt(SMTP_PORT || "587", 10);

    return nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: false,
      auth: {
        user: SENDER_MAIL,
        pass: PASS,
      },
    });
  }

  private async send(to: string, subject: string, html: string): Promise<void> {
    try {
      const transporter = this.getTransporter();
      await transporter.sendMail({
        from: SENDER_MAIL,
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
      .replace(/{{CompanyName}}/g, COMPANY_NAME || "")
      .replace(/{{CompanyDomain}}/g, COMPANY_DOMAIN || "")
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
      .replace(/{{CompanyName}}/g, COMPANY_NAME || "")
      .replace(/{{CompanyDomain}}/g, COMPANY_DOMAIN || "")
      .replace(/{{subject}}/g, subject);

    await this.send(email, subject, html);
  }
}