import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BcryptService } from '../../../shared/services/bcrypt.service';
import { UserService } from '../../user/services/user.service';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private bcryptService: BcryptService,
  ) {}

  async generateOTP() {
    const digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 4; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.getByEmail(email);
    if (user && (await this.bcryptService.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      _id: user._id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      roles: user.roles,
      genre: user.genre,
      tokens: user.tokens,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async info(acessToken: string) {
    return await this.jwtService.verify(acessToken);
  }

  async refreshToken(acessToken: string) {
    const user = await this.jwtService.verify(acessToken);
    const payload = {
      _id: user._id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      roles: user.roles,
      genre: user.genre,
      tokens: user.tokens,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
