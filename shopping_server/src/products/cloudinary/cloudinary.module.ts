import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryService } from './cloudinary.service';

@Module({
    imports: [ConfigModule],
    providers: [
    {
        provide: 'CLOUDINARY_CONFIG',
         useFactory: (configService: ConfigService) => {
        return cloudinary.config({
            cloud_name: configService.getOrThrow('CLOUDINARY_CLOUD_NAME'),
            api_key: configService.getOrThrow('CLOUDINARY_API_KEY'),
            api_secret: configService.getOrThrow('CLOUDINARY_API_SECRET'),
        });
    },
        inject: [ConfigService],
    },
    CloudinaryService
],
    exports: [CloudinaryService ],
})
export class CloudinaryModule {}