import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileService } from './file.service';

@Module({
  providers: [UploadService, FileService],
  exports: [UploadService, FileService]
})
export class UploadModule {}
