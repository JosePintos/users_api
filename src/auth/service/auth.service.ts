/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/require-await */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from 'src/shared/model/role.model';
import { User } from 'src/users/schema/user.schema';

export type JwtPayload = {
  sub: string;
  profile: Role;
  iat?: number;
  exp?: number;
};

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, role: Role): Promise<JwtPayload> {
    const user = await this.userModel.findOne({ email }).populate('profiles');

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const hasPermission = user.profiles.some((p) => p.code === role);

    if (!hasPermission) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const jwtPayload: JwtPayload = {
      sub: user._id as string,
      profile: role,
    };

    return jwtPayload;
  }

  async login(jwtPayload: JwtPayload) {
    return {
      access_token: this.jwtService.sign(jwtPayload),
    };
  }
}
