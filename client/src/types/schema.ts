import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "@/components/Profile/CoverImageForm";
import { z } from "zod";

export const signUpFormSchema = z.object({
    username: z
      .string()
      .min(2, { message: "Username must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string().min(10).max(10),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/^(?=.*[A-Z])(?=.*\d)/, {
        message: "Password must contain 1 uppercase letter and 1 number",
      }),
    otpType: z.boolean().optional(),
    gender: z.string(),
    location: z.object(
      {
        placename: z.string(),
        coordinates: z.array(z.any()),
      },
      { invalid_type_error: "Location is required" }
    ),
    jobRole: z.string().min(1, { message: "Job role is required" }),
  });

 export const companyformSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    website: z.string().url({ message: "Invalid URL" }).optional().or(z.literal('')),
    location: z.array(z.object({
      placename: z.string(),
      coordinates: z.array(z.number()),
    })).min(1, "Comapany location required"),
    size: z.string().min(1, { message: "Organization size is required" }),
    type: z.string().min(1, { message: "Organization type is required" }),
  });

   export const fileSchema = z.object({
      file: z.instanceof(File),
    });
  

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const jobFormSchema = z
    .object({
      jobTitle: z.string().min(4, {
        message: "Job Title must be at least 4 characters",
      }),
      employment: z.enum(
        ["Full-Time", "Part-Time", "Remote", "Internship", "Contract"],
        {
          required_error: "Please select an employment type",
        }
      ),
      minSalary: z.number().min(1000, {
        message: "Minimum salary must be at least 1000",
      }),
      maxSalary: z.number().min(1000, {
        message: "Maximum salary must be at least 1000",
      }),
      skills: z
        .array(
          z.object({
            name: z.string().min(1, "Skill name is required"),
            proficiency: z.enum([
              "Beginner",
              "Intermediate",
              "Advanced",
              "Expert",
            ]),
          })
        )
        .min(1, "At least one skill is required"),
      jobDescription: z
        .string()
        .min(10, "Job description must be at least 10 characters"),
      qualifications: z
        .array(z.string())
        .min(1, "Give at least one qualification"),
      niceToHave: z.array(z.string()).optional(),
      responsibility: z
        .array(z.string())
        .min(4, "Mention proper job responsibility"),
      experience: z
        .number({
          required_error: "experience required",
          invalid_type_error: "experience must be number ",
        })
        .min(0, "Experience must be a non-negative number")
        .int("Experience must be a whole number"),
      vacancies: z.number().int().positive("Vacancies must be at least 1"),
      expiry: z.string().refine((val) => new Date(val) > new Date(), {
        message: "Expiry date must be a future date",
      }),
      jobLocation: z.string().min(1, "Job location is required"),
      officeLocation: z.string(),
    })
    .refine((data) => data.minSalary <= data.maxSalary, {
      message: "Minimum salary cannot be greater than maximum salary",
      path: ["maxSalary"],
    });


   export const jobApplicationFormSchema = z
    .object({
      fullName: z
        .string()
        .min(2, "Full name must be at least 2 characters"),
      email: z
        .string()
        .email("Invalid email address"),
      phone: z
        .string()
        .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
      linkedinUrl: z
        .string()
        .url("Invalid LinkedIn URL")
        .optional()
        .or(z.literal("")),
      portfolioUrl: z
        .string()
        .url("Invalid Portfolio URL")
        .optional()
        .or(z.literal("")),
      coverLetter: z
        .string()
        .max(500, "Additional information must not exceed 500 characters")
        .optional()
        .or(z.literal("")),
      resume: z
        .string()
        .refine((resume) => resume.length > 0, "Upload your resume"),
    })
    .transform((data) => {
      return Object.fromEntries(
        Object.entries(data).filter(
          ([_, value]) => value !== undefined && value !== null && value !== ""
        )
      );
    });

  export const resumeSchema = z.object({
    resume: z
      .instanceof(FileList)
      .refine((files) => files.length > 0, "Resume is required")
      .transform((files) => files[0])
      .refine((files) => files.size <= 5000000, "Resume must be less than 5MB")
      .refine(
        (files) =>
          [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          ].includes(files.type),
        "Resume must be in PDF or Word format"
      ),
  });

  export const profileAboutFormSchema = z.object({
    about: z.string().min(10, "About Me should be at least 10 characters long"),
  });

  export const educationFormSchema = z
  .object({
    school: z.string().min(1, "School name is required"),
    degree: z.string().min(1, "Degree is required"),
    fieldOfStudy: z.string().min(1, "Field of study is required"),
    startDate: z.date({
      required_error: "Start date is required",
    }),
    endDate: z.date().optional(),
    currentlyStudying: z.boolean(),
    grade: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.currentlyStudying) return true;
      if (!data.endDate) return false;
      return data.startDate <= data.endDate;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );
  

  export const statusFormSchema = z.object({
    status: z.enum([
      "applied",
      "inreview",
      "shortlisted",
      "interview",
      "rejected",
      "selected",
    ]),
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
  });

  export const coverImageFormSchema = z.object({
    image: z
      .any()
      .refine((files) => files?.length > 0, "Cover image is required.")
      .transform((files) => files[0])
      .refine(
        (files) => files?.size <= MAX_FILE_SIZE,
        "File size must be less than 5MB."
      )
      .refine(
        (files) => ACCEPTED_IMAGE_TYPES.includes(files?.type),
        "Only .jpg, .png, and .webp formats are accepted."
      ),
  });
  
 

  
  
  
  

 


