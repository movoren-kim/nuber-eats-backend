import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import {
  CreateAccountInputDto,
  CreateAccountOutputDto,
} from './dtos/create-account.dto';
import { LoginInputDto, LoginOutputDto } from './dtos/login.dto';
import { GraphQLError } from 'graphql';
import { AuthService } from 'src/auth/auth.service';
import {
  UpdateProfileInputDto,
  UpdateProfileOutputDto,
} from './dtos/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  async createAccountInput(
    createAccountInput: CreateAccountInputDto,
  ): Promise<CreateAccountOutputDto> {
    try {
      const existEmail = await this.userRepository.findOne({
        where: { email: createAccountInput.email },
      });
      if (existEmail)
        throw new Error('[계정 생성] 이미 존재하는 이메일입니다.');
      const createUserObject = this.userRepository.create(createAccountInput);
      const createUser = await this.userRepository.save(createUserObject);
      if (!createUser)
        throw new Error(
          '[계정 생성] 계정 데이터 생성 중 오류가 발생하였습니다.',
        );
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: error.message ? error.message : '[알 수 없는 에러]',
      };
    }
  }

  async login(loginInput: LoginInputDto): Promise<LoginOutputDto> {
    try {
      const user = await this.userRepository.findOne({
        where: { email: loginInput.email },
        select: ['id', 'password'],
      });
      if (!user) throw new Error('[로그인] 존재하지 않는 이메일입니다.');

      const passwordCorrect = await user.checkPassword(loginInput.password);
      if (!passwordCorrect)
        throw new Error('[로그인] 비밀번호가 일치하지 않습니다.');

      const createToken = await this.authService.generateTokens({
        id: user.id,
      });
      return {
        ok: true,
        token: createToken.accessToken,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: error.message ? error.message : '[알 수 없는 에러]',
      };
    }
  }

  async findById(id: number) {
    try {
      const findUser = await this.userRepository.findOne({
        where: { id },
        select: ['id', 'email', 'role', 'createdAt', 'updatedAt'],
      });
      if (!findUser)
        throw new GraphQLError(
          '[유저 정보 조회] 유저 정보를 찾을 수 없었습니다.',
        );
      return {
        ok: true,
        result: findUser,
      };
    } catch (error) {
      return {
        ok: false,
        error: error.message
          ? error.message
          : '[유저 정보 조회] 알 수 없는 오류가 발생하였습니다.',
      };
    }
  }

  async updateProfile(
    user: User,
    updateProfileInput: UpdateProfileInputDto,
  ): Promise<UpdateProfileOutputDto> {
    try {
      Object.assign(user, updateProfileInput);
      const userUpdate = await this.userRepository.save(user);
      if (!userUpdate)
        throw new Error('[유저 정보 수정] 정보 수정 중 오류가 발생하였습니다.');
    } catch (error) {
      return {
        ok: false,
        error: error.message
          ? error.message
          : '[유저 정보 수정] 알 수 없는 오류가 발생하였습니다.',
      };
    }
  }
}
