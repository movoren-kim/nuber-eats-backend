import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/core.dto';
import { User } from '../entity/user.entity';

@ObjectType()
export class ShowProfileOutputDto extends CoreOutput {
  @Field(() => User)
  result?: User;
}
