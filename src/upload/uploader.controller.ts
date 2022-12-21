import { Bind, Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { UploadService } from './upload.service';
import { FileModelEnum } from './file.enum';
import { UploadFileInput } from './upload-file.input';
import { ModelWhichUploadedFor, Upload, UploadedFile } from './upload.type';
@Controller()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('uploadFiles')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'file1', maxCount: 2 },
      { name: 'file2', maxCount: 2 }
    ])
  )
  async uploadFiles(
    @UploadedFiles()
    files: {
      file1?: Express.Multer.File[];
      file2?: Express.Multer.File[];
    }
  )
  {
    return await this.uploadService.restUpload({
      files,
      saveTo: FileModelEnum.CONSULTANT_ATTACHMENTS,
      modelWhichUploadedFor: null,
      oldFile: null
    });
  }
}
