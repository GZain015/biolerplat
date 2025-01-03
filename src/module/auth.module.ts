/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthController } from '../controller/Auth.controller';
import { UserService } from '../service/user.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { UserModule } from './user.module';
import { PasswordLink } from 'src/entity/PasswordLink.entity';

@Module({
    imports: [UserModule, JwtModule.register({
        global: true,
        secret: process.env.JWT_SECRET,
        signOptions: {
             expiresIn: process.env.JWT_EXPIRY
        },
   }), TypeOrmModule.forFeature([User, PasswordLink])],
    controllers: [AuthController],
    providers: [UserService, JwtService],
})
export class AuthModule {}
