import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Headers, Request, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ChangePasswordDto, LoginAuthDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { MailService } from '../business/mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

//todo considerar estandarizar el como se envia algo seria bueno tenr ya os payload y ya en todo  asi ahorramos en mandar toda esa data 
@Controller('auth')
export class AuthController {
  constructor(
    private readonly mailService: MailService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
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




  @Post('reset-password')
  async resetPassword(
    @Body('newPass') newPass: string,
    @Headers('authorization') authHeader: string
  ) {

    if (!authHeader) throw new UnauthorizedException('Token es requerido');

    const token = authHeader.split(' ')[1]; //sacar token del encabezado 
    const secret = this.configService.get<string>('JWT_RECOVERY_SECRET');
    const decoded = this.jwtService.verify(token, { secret: secret });
    //aqui verificacion que action es del token 
    if (decoded.action !== 'reset_password') {
      throw new UnauthorizedException('Token inválido para esta operación');
    }
    return this.authService.resetPasswordWithToken(decoded.sub, newPass);

  }



  @Post('send-code')
  async sendCode(@Body('email') email: string) {
    if (!email) throw new BadRequestException('Email es requerido');

    return this.authService.sendRecoveryCode(email);


  }

  @Post('verify-code')
  async verifyCode(@Body() body: { email: string; code: string }) {
    return this.authService.verifyOtpGetToken(body.email, body.code);

  }






}



/*
 return {
      message: 'Código enviado correctamente',
      email: email
    };


*/