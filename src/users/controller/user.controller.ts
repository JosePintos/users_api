import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { Roles } from 'src/shared/decorator/roles.decorator';
import { User } from '../schema/user.schema';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { FilterUsersDto } from '../dto/filter-users.dto';
import { ApiOkResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserDto } from '../dto/user-swagger.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado correctamente',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Error de validación o email duplicado',
  })
  @Roles(['ADMIN', 'MOD', 'USER'])
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  @ApiOkResponse({
    description: 'Lista de usuarios filtrada',
    type: [UserDto],
  })
  @Roles(['ADMIN', 'MOD'])
  @Get()
  async findAllUsers(@Query() filters: FilterUsersDto): Promise<User[]> {
    return this.userService.findAllUsers(filters);
  }

  @ApiOperation({ summary: 'Obtener un nuevo usuario' })
  @ApiResponse({
    status: 201,
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Error de validación',
  })
  @Roles(['ADMIN', 'MOD'])
  @Get(':userId')
  async findUserById(@Param('userId') userId: string): Promise<User | null> {
    return this.userService.findUserById(userId);
  }

  @ApiOperation({ summary: 'Actualizar los datos de un usuario' })
  @ApiResponse({
    status: 201,
    description: 'Usuario actualizado correctamente',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Error de validación o usuario no encontrado',
  })
  @Roles(['ADMIN', 'USER'])
  @Patch(':userId')
  async updateUser(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUser(userId, updateUserDto);
  }

  @ApiOperation({ summary: 'Eliminar un usuario' })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado correctamente',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Error de validación o usuario no encontrado',
  })
  @Roles(['ADMIN', 'USER'])
  @Delete(':userId')
  async deleteUser(@Param('userId') userId: string): Promise<User> {
    return this.userService.deleteUser(userId);
  }
}
