/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { FilterUsersDto } from '../dto/filter-users.dto';
import { UserService } from './user.service';
import { User } from '../schema/user.schema';

const mockUser = {
  _id: 'user-id',
  name: 'Test User',
  email: 'test@example.com',
  profiles: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('UserService', () => {
  let service: UserService;
  let userModel: Model<User>;

  const mockUserModel = {
    create: jest.fn().mockResolvedValue(mockUser),
    find: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue([mockUser]),
    }),
    findById: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockUser),
    }),
    findByIdAndUpdate: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockUser),
    }),
    findByIdAndDelete: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockUser),
    }),
    findOne: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userModel = module.get<Model<User>>(getModelToken('User'));
  });

  it('should create a user', async () => {
    const dto: CreateUserDto = {
      name: 'Test',
      email: 'test@example.com',
      age: 31,
      profiles: ['USER'],
    };
    const result = await service.createUser(dto);
    expect(result).toEqual(mockUser);
    expect(userModel.create).toHaveBeenCalledWith(dto);
  });

  it('should throw if email is already in use', async () => {
    const dto: CreateUserDto = {
      name: 'Test',
      email: 'test@example.com',
      age: 29,
      profiles: ['USER'],
    };

    mockUserModel.findOne.mockReturnValueOnce({
      exec: jest.fn().mockResolvedValue(mockUser),
    });

    await expect(service.createUser(dto)).rejects.toThrow(
      'Email already in use',
    );
    expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: dto.email });
    expect(mockUserModel.create).not.toHaveBeenCalled();
  });

  it('should return all users', async () => {
    const filters: FilterUsersDto = {};
    const result = await service.findAllUsers(filters);
    expect(result).toEqual([mockUser]);
    expect(userModel.find).toHaveBeenCalledWith({});
  });

  it('should return a user by id', async () => {
    const result = await service.findUserById('user-id');
    expect(result).toEqual(mockUser);
    expect(userModel.findById).toHaveBeenCalledWith('user-id');
  });

  it('should update a user', async () => {
    const dto: UpdateUserDto = { name: 'Updated Name' };
    const result = await service.updateUser('user-id', dto);
    expect(result).toEqual(mockUser);
    expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith('user-id', dto, {
      new: true,
    });
  });

  it('should delete a user', async () => {
    const result = await service.deleteUser('user-id');
    expect(result).toEqual(mockUser);
    expect(userModel.findByIdAndDelete).toHaveBeenCalledWith('user-id');
  });
});
