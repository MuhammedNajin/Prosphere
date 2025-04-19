

export interface IGetNotificationCountUseCase {
    execute(userId: string): Promise<number | null>
}