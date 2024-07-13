import { Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/core.dto';

@ObjectType()
export class TokenOutput extends CoreOutput {
  @Field(() => String, { nullable: true })
  accessToken?: string;

  @Field(() => String, { nullable: true })
  refreshToken?: string;
}
