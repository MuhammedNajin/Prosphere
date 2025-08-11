import mongoose from "mongoose";
import { AuthProvider, UserRole } from "@/shared/constance";

/**
 * @interface IAuth
 * @description Defines the shape of an authentication object within the application's domain.
 * This should be used to pass authentication data between layers (e.g., from database to services).
 */
export interface IAuth {
  id: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  provider: AuthProvider;
  role: UserRole;
  isVerified: boolean;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}