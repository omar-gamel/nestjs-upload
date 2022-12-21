import { Resolver, Args, Mutation, Query } from '@nestjs/graphql';
import { UploadFileInput } from './upload-file.input';
import { UploadService } from './upload.service';

@Resolver()
export class UploadResolver {
  constructor(private readonly uploadService: UploadService) {}

  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }

  // Auth for upload (issue: STOP IT BECAUSE OF REGISTRATION)
  @Mutation(returns => String)
  async uploadFile(@Args() input: UploadFileInput) {
    return await this.uploadService.graphqlUpload({ file: input.file, saveTo: input.model });
  }
}
