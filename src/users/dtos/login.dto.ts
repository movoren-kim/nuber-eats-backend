import { Field, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/core.dto';
import { User } from '../entity/user.entity';

export class LoginInputDto extends PickType(User, ['email', 'password']) {}

@ObjectType()
export class LoginOutputDto extends CoreOutput {
  @Field(() => String)
  token?: string;
}