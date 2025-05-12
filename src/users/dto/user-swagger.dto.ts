import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ProfileDto } from 'src/profiles/dto/profile-swagger.dto';

export class UserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 30 })
  @IsInt()
  age: number;

  @ApiProperty({ type: [ProfileDto] })
  @ValidateNested({ each: true })
  @Type(() => ProfileDto)
  profiles: ProfileDto[];
}
