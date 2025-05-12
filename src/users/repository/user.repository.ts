import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schema/user.schema';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

export interface IUserRepository {
  createUser(createUserDto: CreateUserDto): Promise<User>;
  findAllUsers(query: Record<string, any>): Promise<User[]>;
  findUserById(userId: string): Promise<User | null>;
  findUserByEmail(email: string): Promise<User | null>;
  updateUser(
    userId: string,
    updatedUserDto: UpdateUserDto,
  ): Promise<User | null>;
  deleteUser(userId: string): Promise<User | null>;
}

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return new this.userModel(createUserDto).save();
  }

  async findAllUsers(query: Record<string, any>): Promise<User[]> {
    return this.userModel.find(query).populate('profiles').exec();
  }

  async findUserById(userId: string): Promise<User | null> {
    return this.userModel.findById(userId).populate('profiles').exec();
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async updateUser(
    userId: string,
    updatedUserDto: UpdateUserDto,
  ): Promise<User | null> {
    return this.userModel
      .findByIdAndUpdate(userId, updatedUserDto, {
        new: true,
        runValidators: true,
      })
      .exec();
  }

  async deleteUser(userId: string): Promise<User | null> {
    return this.userModel.findByIdAndDelete(userId).exec();
  }
}
