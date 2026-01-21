import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  
  @Post()
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {

    return {
      message: 'Este es tu perfil privado',
      user: req.user,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('change-first-password')
  async changePassword(@Request() req, @Body('newPassword') newPassword: string) {
    return this.usersService.updatePassword(req.user.sub, newPassword);
  }





}
