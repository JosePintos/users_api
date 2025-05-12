import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfilesService } from './service/profiles.service';
import { ProfilesController } from './controller/profiles.controller';
import { ProfileSchema } from './schema/profile.schema';
import { ProfilesRepository } from './repository/profiles.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Profile', schema: ProfileSchema }]),
  ],
  controllers: [ProfilesController],
  providers: [
    ProfilesService,
    {
      provide: 'IProfilesRepository',
      useClass: ProfilesRepository,
    },
  ],
  exports: [ProfilesService, MongooseModule, 'IProfilesRepository'],
})
export class ProfilesModule {}
