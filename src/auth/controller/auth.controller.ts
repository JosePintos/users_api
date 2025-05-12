import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { Role } from 'src/shared/model/role.model';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: { email: string; role: Role },
  ): Promise<{ access_token: string }> {
    const jwtPayload = await this.authService.validateUser(
      body.email,
      body.role,
    );
    return this.authService.login(jwtPayload);
  }
}
