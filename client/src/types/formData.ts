import z from "zod";
import {
  companyformSchema,
  coverImageFormSchema,
  educationFormSchema,
  fileSchema,
  jobApplicationFormSchema,
  jobFormSchema,
  profileAboutFormSchema,
  resetPasswordSchema,
  resumeSchema,
  signInSchema,
  signUpFormSchema,
  statusFormSchema,
} from "./schema";

export type signupFormData = z.infer<typeof signUpFormSchema>;
export type Companydata = z.infer<typeof companyformSchema>;
export type Avatar = z.infer<typeof fileSchema>;
export type DocumentVerificationFormData = {
  companyDocType: string;
  ownerDocType: string;
  companyDoc: File | null;
  ownerDoc: File | null;
};
export type SignInFormData = z.infer<typeof signInSchema>;
export type ProficiencyLevel =
  | "Beginner"
  | "Intermediate"
  | "Advanced"
  | "Expert";

export type JobFormData = z.infer<typeof jobFormSchema>;
export type ApplicationFormData = z.infer<typeof jobApplicationFormSchema>;
export type ResumeValues = z.infer<typeof resumeSchema>;
export type AboutFormData = z.infer<typeof profileAboutFormSchema>;
export type EducationFormData = z.infer<typeof educationFormSchema>;
export type StatusFormData = z.infer<typeof statusFormSchema>;
export type FormValues = z.infer<typeof coverImageFormSchema>;
export type ResetFormData = z.infer<typeof resetPasswordSchema>