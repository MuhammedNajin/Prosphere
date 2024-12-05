
export interface IPaymentRepository {
    create(payment): Promise<void>
} 