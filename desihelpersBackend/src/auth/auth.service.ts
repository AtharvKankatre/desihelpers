import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async signIn(
    email: string,
    pass: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.usersService.findOne(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload = { email: user.email, roles: [], isProfile: false }; // You might want to fetch actual roles/profile status from user entity
    const access_token = await this.jwtService.signAsync(payload);
    const refresh_token = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    }); // Longer expiry for refresh token

    return {
      access_token,
      refresh_token,
    };
  }

  async refreshToken(refresh_token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refresh_token);
      const newPayload = { email: payload.email, roles: [], isProfile: false };
      return {
        access_token: await this.jwtService.signAsync(newPayload),
        refresh_token: refresh_token, // Return same refresh token or rotate it
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
