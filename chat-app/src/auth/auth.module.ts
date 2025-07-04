// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from '../modules/users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy'; // Optionnel (pour la protection des routes)

@Module({
    imports: [
        UsersModule, // Nécessaire pour UsersService
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '1d' },
        }),
    ],
    providers: [AuthService, AuthResolver, JwtStrategy], // Ajoutez JwtStrategy si vous utilisez Passport
    exports: [AuthService], // Si d'autres modules en ont besoin
})
export class AuthModule {}