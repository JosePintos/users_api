import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProfilesService } from '../service/profiles.service';
import { Roles } from 'src/shared/decorator/roles.decorator';
import { CreateProfileDto } from '../dto/create-profile.dto';
import { Profile } from '../schema/profile.schema';
import { ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Roles(['ADMIN'])
  @Post()
  @ApiOperation({ summary: 'Crear un perfil' })
  @ApiResponse({
    status: 201,
    description: 'Perfil creado exitosamente',
    type: Profile,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async createProfile(
    @Body() createProfileDto: CreateProfileDto,
  ): Promise<Profile> {
    return this.profilesService.createProfile(createProfileDto);
  }

  @Roles(['ADMIN'])
  @Get()
  @ApiOperation({ summary: 'Listar todos los perfiles' })
  @ApiResponse({
    status: 200,
    description: 'Lista de perfiles',
    type: [Profile],
  })
  async findAllProfiles(): Promise<Profile[]> {
    return this.profilesService.findAllProfiles();
  }

  @Roles(['ADMIN'])
  @Get(':profileId')
  @ApiOperation({ summary: 'Buscar un perfil por su ID' })
  @ApiParam({ name: 'profileId', type: String })
  @ApiResponse({ status: 200, description: 'Perfil encontrado', type: Profile })
  async findProfileById(
    @Param('profileId') profileId: string,
  ): Promise<Profile | null> {
    return this.profilesService.findProfileById(profileId);
  }
}
