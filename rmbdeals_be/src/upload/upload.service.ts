import { Injectable } from '@nestjs/common';
import { FileService } from './file.service';

@Injectable()
export class UploadService {
    constructor(private readonly fileService:FileService){}

    async addAttachment(imageBuffer: Buffer, filename:string){
        return await this.fileService.uploadAsset(imageBuffer, filename)
    }
    
    async deleteAttachment(filename:string){
        return await this.fileService.deleteAsset(filename)
    }

    async getSignedUrl(filename:string){
    return await this.fileService.getPresignedUrl(filename)
  }
}
