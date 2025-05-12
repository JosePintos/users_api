import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../repository/user.repository';
import { User } from '../schema/user.schema';
import { CreateUserDto } from '../dto/create-user.dto';
import { IProfilesRepository } from 'src/profiles/repository/profiles.repository';
import { UpdateUserDto } from '../dto/update-user.dto';
import { FilterUsersDto } from '../dto/filter-users.dto';

export interface IUserService {
  createUser(createUserDto: CreateUserDto): Promise<User>;
  findAllUsers(filters: FilterUsersDto): Promise<User[]>;
  findUserById(userId: string): Promise<User | null>;
  updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<User>;
  deleteUser(userId: string): Promise<User>;
}

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    @Inject('IProfilesRepository')
    private readonly profilesRepository: IProfilesRepository,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const profilesDocs = await this.profilesRepository.findProfilesByCodes(
      createUserDto.profiles,
    );

    if (profilesDocs.length !== createUserDto.profiles.length) {
      throw new BadRequestException('Uno o más perfiles no existen');
    }

    const userExists = await this.userRepository.findUserByEmail(
      createUserDto.email,
    );

    if (userExists) {
      throw new BadRequestException('Email ya registrado');
    }

    const userData = {
      ...createUserDto,
      profiles: profilesDocs.map((profile) => profile._id as string),
    };

    return await this.userRepository.createUser(userData);
  }

  async findAllUsers(filters: FilterUsersDto): Promise<User[]> {
    const query: Record<string, any> = {};

    if (filters.name) {
      query.name = { $regex: filters.name, $options: 'i' };
    }

    if (filters.age) {
      query.age = filters.age;
    }

    if (filters.profileCode) {
      const profiles = await this.profilesRepository.findProfilesByCodes([
        filters.profileCode,
      ]);
      if (profiles.length > 0) {
        query.profiles = profiles[0]._id;
      }
    }
    return await this.userRepository.findAllUsers(query);
  }

  async findUserById(userId: string): Promise<User | null> {
    return await this.userRepository.findUserById(userId);
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const updatedUser = await this.userRepository.updateUser(
      userId,
      updateUserDto,
    );

    if (!updatedUser) {
      throw new BadRequestException('No se encontró el usuario');
    }

    return updatedUser;
  }

  async deleteUser(userId: string): Promise<User> {
    const deletedUser = await this.userRepository.deleteUser(userId);

    if (!deletedUser) {
      throw new BadRequestException('No se encontró el usuario');
    }

    return deletedUser;
  }
}
