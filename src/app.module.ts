import { Module } from '@nestjs/common';
import { UploadModule } from './upload/upload.module';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloDriver } from '@nestjs/apollo';
@Module({
  imports: [
    UploadModule,
    GraphQLModule.forRootAsync({
      imports: [UploadModule],
      useFactory: () => ({
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        context: () => ({})
      }),
      inject: [],
      driver: ApolloDriver
    })
  ],
  exports: []
})
export class AppModule {}
