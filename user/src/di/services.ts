import { Container } from 'inversify';
import { CloudStorageService } from '@/infrastructure/service/cloud-storage.service';
import { ImageService } from '@/infrastructure/service/Image-resize.service';
import { ICloudStorageService } from '@/infrastructure/interface/service/ICloud-storage.service';
import { Services } from './symbols';

export async function bindServices(container: Container) {
    container.bind<ICloudStorageService>(Services.CloudStorageService).to(CloudStorageService).inSingletonScope();
    container.bind<ImageService>(Services.ImageService).to(ImageService).inSingletonScope();
}
