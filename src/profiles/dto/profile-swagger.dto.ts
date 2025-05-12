import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ProfileDto {
  @ApiProperty({ example: 'ADMIN' })
  @IsString()
  code: string;

  @ApiProperty({ example: 'Administrador' })
  @IsString()
  name: string;
}
