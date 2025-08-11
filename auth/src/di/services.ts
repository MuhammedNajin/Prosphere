import { Container } from 'inversify';
import { redisClient, RedisClient } from '@/config/redisConnection';
import { TokenService } from '@/infrastructure/services/token.service';
import { MailService } from '@/infrastructure/services/mail.service';
import { HashService } from '@/infrastructure/services/hash.service';
import { OtpService } from '@/infrastructure/services/otp.service';
import { CacheService } from '@/infrastructure/services/cache.service';
import { CloudStorageService } from '@/infrastructure/services/cloud-storage.service';
import { ITokenService } from '@/infrastructure/interface/service/ITokenService';
import { IMailService } from '@/infrastructure/interface/service/IMailService';
import { IHashService } from '@/infrastructure/interface/service/IHashService';
import { IOtpService } from '@/infrastructure/interface/service/IOtpService';
import { ICacheService } from '@/infrastructure/interface/service/ICacheService';
import { ICloudStorageService } from '@/infrastructure/interface/service/ICloudStorageService';
import { Services } from './symbols';

export async function bindServices(container: Container) {
    // Ensure Redis is connected before binding
    await redisClient.connect();
    container.bind<RedisClient>(Services.RedisClient).toConstantValue(redisClient.getClient());
    container.bind<ITokenService>(Services.TokenService).to(TokenService).inSingletonScope();
    container.bind<IMailService>(Services.MailService).to(MailService).inSingletonScope();
    container.bind<IHashService>(Services.HashService).to(HashService).inSingletonScope();
    container.bind<IOtpService>(Services.OtpService).to(OtpService).inSingletonScope();
    container.bind<ICacheService>(Services.CacheService).to(CacheService).inSingletonScope();
    container.bind<ICloudStorageService>(Services.CloudStorageService).to(CloudStorageService).inSingletonScope();
}
