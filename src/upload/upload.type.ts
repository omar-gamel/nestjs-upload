import { Stream } from 'stream';

export interface Upload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => Stream;
}

export interface UploadedFile {
  filename: string;
  originalname: string;
  path: string;
  mimetype: string;
  size: number;
  buffer?: Buffer;
}

export interface ModelWhichUploadedFor {
  modelName: string;
  modelDestination: string;
  modelId: string;
}
