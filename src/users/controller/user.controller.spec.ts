/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { FilterUsersDto } from '../dto/filter-users.dto';
import { UserController } from './user.controller';
import { UserService } from '../service/user.service';
import { User } from '../schema/user.schema';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUser: Partial<User> = {
    _id: 'user-id',
    name: 'Test User',
    email: 'test@example.com',
    age: 30,
    profiles: [],
  };

  const mockUserService = {
    createUser: jest.fn().mockResolvedValue(mockUser),
    findAllUsers: jest.fn().mockResolvedValue([mockUser]),
    findUserById: jest.fn().mockResolvedValue(mockUser),
    updateUser: jest.fn().mockResolvedValue(mockUser),
    deleteUser: jest.fn().mockResolvedValue(mockUser),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should create a user', async () => {
    const dto: CreateUserDto = {
      name: 'Test',
      email: 'test@example.com',
      age: 30,
      profiles: ['USER'],
    };
    const result = await controller.createUser(dto);
    expect(result).toEqual(mockUser);
    expect(service.createUser).toHaveBeenCalledWith(dto);
  });

  it('should return all users', async () => {
    const filters: FilterUsersDto = {};
    const result = await controller.findAllUsers(filters);
    expect(result).toEqual([mockUser]);
    expect(service.findAllUsers).toHaveBeenCalledWith(filters);
  });

  it('should return a user by id', async () => {
    const result = await controller.findUserById('user-id');
    expect(result).toEqual(mockUser);
    expect(service.findUserById).toHaveBeenCalledWith('user-id');
  });

  it('should update a user', async () => {
    const dto: UpdateUserDto = { name: 'Updated Name' };
    const result = await controller.updateUser('user-id', dto);
    expect(result).toEqual(mockUser);
    expect(service.updateUser).toHaveBeenCalledWith('user-id', dto);
  });

  it('should delete a user', async () => {
    const result = await controller.deleteUser('user-id');
    expect(result).toEqual(mockUser);
    expect(service.deleteUser).toHaveBeenCalledWith('user-id');
  });
});
