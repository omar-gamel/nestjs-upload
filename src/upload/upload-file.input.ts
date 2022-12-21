import { Field, ArgsType } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import { FileModelEnum } from './file.enum';
import { UploadScalar } from './upload.scalar';
import { ModelWhichUploadedFor, Upload, UploadedFile } from './upload.type';

@ArgsType()
export class UploadFileInput {
  @Exclude()
  @Field(type => UploadScalar,{nullable : true})
  file?: Upload | string;

  @Field(type => FileModelEnum, { nullable: true })
  model?: FileModelEnum;
}

export class FileHandlingInput {
  file: Upload | string | UploadedFile;

  saveTo: FileModelEnum;

  modelWhichUploadedFor?: ModelWhichUploadedFor;

  oldFile?: string;
}
