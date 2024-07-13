import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import {
  CreateAccountInputDto,
  CreateAccountOutputDto,
} from './dtos/create-account.dto';
import { LoginInputDto, LoginOutputDto } from './dtos/login.dto';
import { Public } from 'src/auth/decorators/skip-auth';
import { ShowProfileOutputDto } from './dtos/show-profile.dto';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { User } from './entity/user.entity';
import {
  UpdateProfileInputDto,
  UpdateProfileOutputDto,
} from './dtos/update-profile.dto';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Query(() => String)
  sayHello(): string {
    return 'Hello';
  }

  @Public()
  @Mutation(() => CreateAccountOutputDto)
  async createAccount(
    @Args('input') createAccountInput: CreateAccountInputDto,
  ): Promise<CreateAccountOutputDto> {
    return await this.usersService.createAccount(createAccountInput);
  }

  @Public()
  @Mutation(() => LoginOutputDto)
  async login(
    @Args('input') loginInput: LoginInputDto,
  ): Promise<LoginOutputDto> {
    return await this.usersService.login(loginInput);
  }

  @Query(() => ShowProfileOutputDto)
  async showProfile(@AuthUser() user: User): Promise<ShowProfileOutputDto> {
    return { ok: true, result: user };
  }

  @Mutation(() => UpdateProfileOutputDto)
  async updateProfile(
    @AuthUser() user: User,
    @Args('input') updateProfileInput: UpdateProfileInputDto,
  ): Promise<UpdateProfileOutputDto> {
    return await this.usersService.updateProfile(user, updateProfileInput);
  }
}
