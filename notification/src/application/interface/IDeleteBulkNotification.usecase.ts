

export interface IDeleteBulkNotificationUseCase {
    execute(ids: string[]): Promise<void>
}