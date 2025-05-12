/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserService } from './user.service';
import { BadRequestException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;

  const mockUserRepository = {
    createUser: jest.fn(),
    findUserByEmail: jest.fn(),
    findAllUsers: jest.fn(),
    findUserById: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  };

  const mockProfilesRepository = {
    findProfilesByCodes: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: 'IUserRepository',
          useValue: mockUserRepository,
        },
        {
          provide: 'IProfilesRepository',
          useValue: mockProfilesRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const dto: CreateUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        age: 25,
        profiles: ['ADMIN'],
      };

      const profileMock = [{ _id: 'mock-profile-id', code: 'ADMIN' }];

      mockProfilesRepository.findProfilesByCodes.mockResolvedValue(profileMock);
      mockUserRepository.findUserByEmail.mockResolvedValue(null);
      mockUserRepository.createUser.mockResolvedValue({
        ...dto,
        profiles: ['mock-profile-id'],
      });

      const result = await service.createUser(dto);

      expect(mockProfilesRepository.findProfilesByCodes).toHaveBeenCalledWith(
        dto.profiles,
      );
      expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith(
        dto.email,
      );
      expect(mockUserRepository.createUser).toHaveBeenCalledWith({
        ...dto,
        profiles: ['mock-profile-id'],
      });
      expect(result.email).toBe(dto.email);
    });

    it('should throw if email is already registered', async () => {
      const dto: CreateUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        age: 25,
        profiles: ['ADMIN'],
      };

      mockProfilesRepository.findProfilesByCodes.mockResolvedValue([
        { _id: 'id', code: 'ADMIN' },
      ]);
      mockUserRepository.findUserByEmail.mockResolvedValue({ id: 'existing' });

      await expect(service.createUser(dto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw if some profiles do not exist', async () => {
      const dto: CreateUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        age: 25,
        profiles: ['ADMIN', 'MOD'],
      };

      mockProfilesRepository.findProfilesByCodes.mockResolvedValue([
        { _id: 'id', code: 'ADMIN' },
      ]);

      await expect(service.createUser(dto)).rejects.toThrow(
        'Uno o más perfiles no existen',
      );
    });
  });
});
