import { IPlan } from "@/shared/types/plan.interface";

export interface IUserRepository {
    create(user): Promise<void>
} 