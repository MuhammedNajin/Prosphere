
export interface IReadNotificationsUseCase {
    execute(ids: string[]): Promise<void>
}