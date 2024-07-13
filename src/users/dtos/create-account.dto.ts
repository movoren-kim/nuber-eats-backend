import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { User } from '../entity/user.entity';
import { CoreOutput } from 'src/common/dto/core.dto';

@InputType()
export class CreateAccountInputDto extends PickType(User, [
  'email',
  'password',
  'role',
]) {}

@ObjectType()
export class CreateAccountOutputDto extends CoreOutput {}
