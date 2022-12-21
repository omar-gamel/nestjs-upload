import { registerEnumType } from '@nestjs/graphql';

export enum FileModelEnum {
  CONSULTANT_ATTACHMENTS = 'consultant-attachments'
}
registerEnumType(FileModelEnum, { name: 'FileModelEnum' });
