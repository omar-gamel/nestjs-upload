import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { graphqlUploadExpress } from 'graphql-upload';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use('/graphql', graphqlUploadExpress({ maxFileSize: 10 * 1024 * 1024, maxFiles: 10 }));
  await app.listen(5000);
}
bootstrap();
