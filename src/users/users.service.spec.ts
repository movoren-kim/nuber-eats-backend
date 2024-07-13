import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { AuthService } from 'src/auth/auth.service';

const mockRepository = {
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
};

const mockAuthService = {
  generateTokens: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;
  beforeAll(async () => {
    const testingModules = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();
    service = testingModules.get<UsersService>(UsersService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it.todo('createAccountInput');
  it.todo('login');
  it.todo('findById');
  it.todo('updateProfile');
});
