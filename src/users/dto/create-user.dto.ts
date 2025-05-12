import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre completo del usuario',
  })
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    example: 'juan@example.com',
    description: 'Email único del usuario',
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: 30, description: 'Edad del usuario' })
  @IsNumber()
  readonly age: number;

  @ApiProperty({
    example: ['ADMIN', 'USER'],
    description: 'Códigos de los perfiles a asignar',
    isArray: true,
  })
  @IsArray()
  @IsNotEmpty({ each: true })
  readonly profiles: string[];
}
