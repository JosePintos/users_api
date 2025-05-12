import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile } from '../schema/profile.schema';
import { CreateProfileDto } from '../dto/create-profile.dto';

export interface IProfilesRepository {
  createProfile(createProfileDto: CreateProfileDto): Promise<Profile>;
  findAllProfiles(): Promise<Profile[]>;
  findProfileById(profileId: string): Promise<Profile | null>;
  findProfilesByCodes(profilesCodes: string[]): Promise<Profile[]>;
}

@Injectable()
export class ProfilesRepository implements IProfilesRepository {
  constructor(@InjectModel('Profile') private profilesModel: Model<Profile>) {}

  async createProfile(createProfileDto: CreateProfileDto): Promise<Profile> {
    return new this.profilesModel(createProfileDto).save();
  }

  async findAllProfiles(): Promise<Profile[]> {
    return this.profilesModel.find().exec();
  }

  async findProfileById(profileId: string): Promise<Profile | null> {
    return this.profilesModel.findById(profileId);
  }

  async findProfilesByCodes(profilesCodes: string[]): Promise<Profile[]> {
    return this.profilesModel.find({ code: { $in: profilesCodes } }).exec();
  }
}
