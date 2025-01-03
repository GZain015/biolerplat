/* eslint-disable prettier/prettier */
import { Body, Controller, HttpStatus, Logger, Post, Req, Res, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/guard/Auth.guard';
import { UserService } from '../service/user.service';
import { User } from 'src/entity/user.entity';
import { CreateUserDto } from 'src/dto/userDtos/createUser.dto';


class AuthRequest {
     @IsNotEmpty({ message: "email is required" })
     @MaxLength(250)
     @IsEmail()
     email: string;

     @IsNotEmpty({ message: "password is required" })
     @MaxLength(250)
     @MinLength(6)
     password: string;
}

@Controller('auth')
export class AuthController {

     private readonly logger = new Logger(AuthController.name);

     private readonly saltOrRounds = parseInt(process.env.PASSWORD_ROUNDS);

     constructor(private userService: UserService, private jwtService: JwtService) { }

     @Post('/signup')
     async createUser(
          @Body() user: User,
          @Body() createUserDTO: CreateUserDto,
          @Req() request: Request,
          @Res({ passthrough: true }) response: Response,
     ) {
        if (!user) {
            response.status(HttpStatus.BAD_REQUEST).json({
                    message: 'User details required',
                    data: null,
            });
            return;
        }
        let result = await this.userService.getUserByEmail(user.email);
        if (result) {
            response.status(HttpStatus.BAD_REQUEST).json({
                    message: 'User Already Exists',
                    data: null,
            });
            return;
        }

        const hashedPassword = await bcrypt.hash(
            user.password,
            this.saltOrRounds
        );

     //    user.password = hashedPassword;
        user.password = hashedPassword;
        
     //    result = await this.userService.create(user);
        result = await this.userService.create(createUserDTO);
        const registedUser = await this.userService.getUserByEmail(user.email);

        const token = await this.jwtService.signAsync(
            JSON.parse(JSON.stringify(registedUser)),
            {
                    expiresIn: '1d',
                    secret: process.env.JWT_SECRET,
            },
        );

        result.password = undefined;

        response.status(HttpStatus.OK).json({
            message: 'Success',
            token: token,
            data: result,
            
        });
     }

     @Post('/login')
     async login(
          @Body() authRequest: AuthRequest,
          @Req() request: Request,
          @Res({ passthrough: true }) response: Response
     ) {
        
          const result = await this.userService.getUserByEmail(authRequest.email);
          if (!result) {
               response.status(HttpStatus.BAD_REQUEST)
                    .json({
                         message: "User Not Found",
                         data: null
                    });
               return;
          }

          const passwordValid = await bcrypt.compare(authRequest.password, result.password);

          if (!passwordValid) {
               response.status(HttpStatus.BAD_REQUEST)
                    .json({
                         message: "Password Invalid",
                         data: null
                    });
               return;
          }

          await this.userService.saveUser(result);
          result.password = undefined;


          const token = await this.jwtService.signAsync(JSON.parse(JSON.stringify(result)), {
               expiresIn: '1d',
               secret: process.env.JWT_SECRET
          });

          response.status(HttpStatus.OK).json({
               message: `Login successful`,
               token: token,
               data: result 
          });
     
     }

     @UseGuards(AuthGuard)
     @Post('/logout')
     async logout(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
         
          response.clearCookie('token');
          response.status(HttpStatus.OK).json({
               message: 'Logout successful',
          });
     }

}

