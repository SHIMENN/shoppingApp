import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { type UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import * as streamifier from 'streamifier';


@Injectable()
export class CloudinaryService {
  
  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'products',
        },
        (error, result) => {
          if (error) return reject(error);
          
          // הבדיקה שפותרת את השגיאה:
          if (!result) {
            return reject(new Error('Cloudinary upload result is undefined'));
          }
          
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}