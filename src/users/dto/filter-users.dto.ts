import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterUsersDto {
  @ApiPropertyOptional({
    example: 'Juan',
    description: 'Filtrar por nombre del usuario',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 30,
    description: 'Filtrar por edad del usuario',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  age?: number;

  @ApiPropertyOptional({
    example: 'ADMIN',
    description: 'Filtrar por código de perfil del usuario',
  })
  @IsOptional()
  @IsString()
  profileCode?: string;
}
