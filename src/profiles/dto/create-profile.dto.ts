import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProfileDto {
  @ApiProperty({
    description: 'Nombre del perfil',
    example: 'Administrador',
  })
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    description: 'Código del perfil',
    example: 'ADMIN',
  })
  @IsNumber()
  readonly code: string;
}
