import { Inject, Injectable } from '@nestjs/common';
import { CreateProfileDto } from '../dto/create-profile.dto';
import { Profile } from '../schema/profile.schema';
import { IProfilesRepository } from '../repository/profiles.repository';

export interface IProfilesService {
  createProfile(createProfileDto: CreateProfileDto): Promise<Profile>;
  findAllProfiles(): Promise<Profile[]>;
  findProfileById(profileId: string): Promise<Profile | null>;
}

@Injectable()
export class ProfilesService implements IProfilesService {
  constructor(
    @Inject('IProfilesRepository')
    private readonly profilesRepository: IProfilesRepository,
  ) {}

  async createProfile(createProfileDto: CreateProfileDto): Promise<Profile> {
    return await this.profilesRepository.createProfile(createProfileDto);
  }

  async findAllProfiles(): Promise<Profile[]> {
    return await this.profilesRepository.findAllProfiles();
  }

  async findProfileById(profileId: string): Promise<Profile | null> {
    return await this.profilesRepository.findProfileById(profileId);
  }
}
