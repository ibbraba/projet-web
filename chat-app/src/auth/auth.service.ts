/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../modules/users/services/users.service';
import { User } from '../modules/users/models/user.model';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginInput } from './dto/login.input';
import dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.usersService.findUserByEmail(email);
    console.log(user);
    
    if (user && (await bcrypt.compare(pass, user.password))) {
      return user;
    }
    return null;
  }

  async login(loginInput: LoginInput) {
    const user = await this.validateUser(loginInput.email, loginInput.password);
    if (!user) throw new UnauthorizedException();

    return {
      access_token: this.jwtService.sign({
        sub: user.id,
        email: user.mail,
      
      }, { secret : process.env.JWT_SECRET }),
      user: {
        id: user.id,
        mail: user.mail,
        lastLogin: new Date(), // Mise à jour locale (optionnel)
      },
    };
  }
}
