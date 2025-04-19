import { ICreatePaymentParams } from "@/shared/types/payment.interface";

export interface ICreatePaymentCase {
  execute(data: ICreatePaymentParams): Promise<string>;
}
