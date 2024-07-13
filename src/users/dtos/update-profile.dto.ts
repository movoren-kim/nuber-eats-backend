import { InputType, ObjectType, PartialType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/core.dto';
import { User } from '../entity/user.entity';

@InputType()
export class UpdateProfileInputDto extends PartialType(User) {}

@ObjectType()
export class UpdateProfileOutputDto extends CoreOutput {}
