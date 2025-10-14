import { Services } from "@/di/symbols";
import { ICloudStorageService } from "@/infrastructure/interface/services/ICloudStorageService";
import { inject, injectable } from "inversify";

@injectable()
export class GetUploadedFileUseCase {
  constructor(
    @inject(Services.CloudStorageService) private cloudStorageService: ICloudStorageService
  ) {}

  async execute(key: string): Promise<string> {
     return this.cloudStorageService.getSignedUrl(key)
  }
}