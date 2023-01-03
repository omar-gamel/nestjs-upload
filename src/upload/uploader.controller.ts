import {
  Bind,
  Controller,
  Get,
  Param,
  Post,
  Res,
  StreamableFile,
  UploadedFiles,
  UseInterceptors
} from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { UploadService } from './upload.service';
import { FileModelEnum } from './file.enum';
import { UploadFileInput } from './upload-file.input';
import { ModelWhichUploadedFor, Upload, UploadedFile } from './upload.type';
import { Response } from 'express';
import { join } from 'path';
import * as fs from 'fs';

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
  ) {
    return await this.uploadService.restUpload({
      files,
      saveTo: FileModelEnum.CONSULTANT_ATTACHMENTS,
      modelWhichUploadedFor: null,
      oldFile: null
    });
  }

  @Get('download/:id')
  async downloadFile(@Param() params, @Res() res) {
    const filePath = join(process.cwd(), 'public', params.id);
    return res.download(filePath);
  }

  @Get('*/:id')
  async getFile(@Param() params, @Res() res): Promise<string> {
    const filePath = join(process.cwd(), 'public', params['0'], params.id);
    if (!fs.existsSync(filePath)) return res.send('file not found');

    return res.sendFile(filePath);
  }

  @Get('/:id')
  async getFiles(@Param() params, @Res() res): Promise<string> {
    const filePath = join(process.cwd(), 'public', params.id);

    if (!fs.existsSync(filePath)) return res.send('file not found');

    return res.sendFile(filePath);
  }
}
