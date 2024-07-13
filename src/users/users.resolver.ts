import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import {
  CreateAccountInputDto,
  CreateAccountOutputDto,
} from './dtos/create-account.dto';
import { LoginInputDto, LoginOutputDto } from './dtos/login.dto';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => String)
  sayHello(): string {
    return 'Hello';
  }

  @Mutation(() => CreateAccountOutputDto)
  async createAccount(
    @Args('input') createAccountInput: CreateAccountInputDto,
  ): Promise<CreateAccountOutputDto> {
    return await this.usersService.createAccountInput(createAccountInput);
  }

  @Mutation(() => LoginOutputDto)
  async login(
    @Args('input') loginInput: LoginInputDto,
  ): Promise<LoginOutputDto> {
    return await this.usersService.login(loginInput);
  }
}
