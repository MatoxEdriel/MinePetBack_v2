import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginAuthDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
  ) { }


  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Body() loginDto: LoginAuthDto, @Request() req) {

    return this.authService.login(req.user);
  }






}
