import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import {
  CreateAccountInputDto,
  CreateAccountOutputDto,
} from './dtos/create-account.dto';
import { LoginInputDto, LoginOutputDto } from './dtos/login.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
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
      });
      if (!user) throw new Error('[로그인] 존재하지 않는 이메일입니다.');

      const passwordCorrect = await user.checkPassword(loginInput.password);
      if (!passwordCorrect)
        throw new Error('[로그인] 비밀번호가 일치하지 않습니다.');
      return {
        ok: true,
        token: 'string',
      };
    } catch (error) {
      return {
        ok: false,
        error: error.message ? error.message : '[알 수 없는 에러]',
      };
    }
  }
}
