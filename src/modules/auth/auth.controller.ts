import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ChangePasswordDto, LoginAuthDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { MailService } from '../business/mail/mail.service';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly mailService: MailService,
    private readonly authService: AuthService,
  ) { }


  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Body() loginDto: LoginAuthDto, @Request() req) {

    return this.authService.login(req.user);
  }


  @UseGuards(AuthGuard('jwt'))
  @Patch('change-password')
  async changePassword(@Request() req, @Body() changePassDto: ChangePasswordDto) {
    const userId = req.user.userId;
    return this.authService.changePassword(userId, changePassDto.pass);
  }




  @Post('send-code')
  async sendCode(@Body('email') email: string) {
    if (!email) throw new BadRequestException('Email es requerido');

    return this.authService.sendRecoveryCode(email);


  }
}



/*
 return {
      message: 'Código enviado correctamente',
      email: email
    };


*/