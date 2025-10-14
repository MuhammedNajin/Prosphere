import { Container } from 'inversify';
import { TokenService } from '@/infrastructure/services/token.service';
import { CloudStorageService } from '@/infrastructure/services/cloud-storage.service';


import { Services } from './symbols';
import { ICloudStorageService } from '@/infrastructure/interface/services/ICloudStorageService';
import { ITokenService } from '@/infrastructure/interface/services/ITokenService';
import { IHashService } from '@/infrastructure/interface/services/IHashService';
import { HashService } from '@/infrastructure/services/hash.service';

export async function bindServices(container: Container) {
    container.bind<ITokenService>(Services.TokenService).to(TokenService).inSingletonScope();
    container.bind<IHashService>(Services.HashService).to(HashService).inSingletonScope();
    container.bind<ICloudStorageService>(Services.CloudStorageService).to(CloudStorageService).inSingletonScope();
}
