import { Injectable } from '@nestjs/common';
import { createWriteStream, unlinkSync, existsSync, mkdirSync, writeFile, promises } from 'fs';
import { ModelWhichUploadedFor, Upload, UploadedFile } from './upload.type';
import { FileHandlingInput } from './upload-file.input';
import { extname } from 'path';
import { FileModelEnum } from './file.enum';

@Injectable()
export class UploadService {
  constructor() {}

  async graphqlUpload(input: FileHandlingInput): Promise<string> {
    const absoluteDiskDestination = `${process.cwd()}/public/${input.saveTo}`;
    // Delete the old file
    if (input.oldFile) {
      const filePath = `${absoluteDiskDestination}/${this.getFileNameFromUrl(input.oldFile)}`;
      if (existsSync(filePath)) this.deleteFile(filePath);
    }

    if (typeof input.file === 'string') {
      return input.file;
    } else {
      const { filename, createReadStream, mimetype, encoding } = await (<Promise<Upload>>(
        (<unknown>input.file)
      ));
      const name = `${Date.now()}-${filename}`;
      const relativeDiskDestination = `${input.saveTo}/${name}`;
      if (!existsSync(absoluteDiskDestination))
        mkdirSync(absoluteDiskDestination, { recursive: true });

      // Save the new file
      return new Promise((resolve, reject) => {
        createReadStream()
          .on('error', err => reject(err))
          .pipe(createWriteStream(`${absoluteDiskDestination}/${name}`))
          .on('finish', async () => {
            const fileStat = await promises.stat(`${absoluteDiskDestination}/${name}`);
            resolve(relativeDiskDestination);
          })
          .on('error', () => reject(false));
      });
    }
  }

  async restUpload(input: {
    files: any;
    saveTo: FileModelEnum;
    modelWhichUploadedFor?: ModelWhichUploadedFor;
    oldFile?: string;
  }) {
    let res = [];
    for (let fieldName in input.files) {
      for (let fileInput of input.files[fieldName]) {
        const absoluteDiskDestination = `${process.cwd()}/public/${input.saveTo}`;

        // Delete the old file
        if (input.oldFile) {
          const filePath = `${absoluteDiskDestination}/${this.getFileNameFromUrl(input.oldFile)}`;
          if (existsSync(filePath)) this.deleteFile(filePath);
        }

        const file = fileInput as UploadedFile;
        const name = `${Date.now()}-${fileInput.fieldname}${extname(fileInput.originalname)}`;
        const relativeDiskDestination = `${input.saveTo}/${name}`;

        if (!existsSync(absoluteDiskDestination))
          mkdirSync(absoluteDiskDestination, { recursive: true });
        await this.asyncWrite(`${absoluteDiskDestination}/${name}`, file.buffer);

        const fileStat = await promises.stat(`${absoluteDiskDestination}/${name}`);
        res.push({
          fieldName: fieldName,
          relativeDiskDestination,
          name,
          sizeInBytes: fileStat.size,
          hasReferenceAtDatabase: false,
          ...(fileInput.encoding && { encoding: fileInput.encoding }),
          ...(fileInput.mimetype && { mimetype: fileInput.mimetype }),
          ...(input.modelWhichUploadedFor && {
            modelWhichUploadedFor: input.modelWhichUploadedFor
          })
        });
      }
    }
    return res;
  }

  public getFileNameFromUrl(url: string): string {
    return url.split('/').reverse()[0];
  }

  private deleteFile(file: string, saveTo?: string): void {
    let filePath = file;
    if (saveTo) filePath = `${process.cwd()}/public/${saveTo}/${this.getFileNameFromUrl(file)}`;
    if (existsSync(filePath)) unlinkSync(filePath);
  }

  private asyncWrite(path: string, data: Buffer): Promise<void> {
    return new Promise((resolve, reject) => {
      writeFile(path, data, err => {
        if (err) reject(err);
        resolve();
      });
    });
  }
}
