import { Module } from '@nestjs/common';
import { UploadResolver } from './upload.resolver';
import { UploadScalar } from './upload.scalar';
import { UploadService } from './upload.service';
import { UploadController } from './uploader.controller';

@Module({
  controllers: [UploadController],
  providers: [UploadScalar, UploadService, UploadResolver],
  exports: [UploadScalar, UploadService]
})
export class UploadModule {}
