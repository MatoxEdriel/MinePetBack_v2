import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { PaginationDto } from 'src/interfaces/pagination.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }


  @Post()
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  async getAll(@Query() pagination: PaginationDto) {



    return this.usersService.getAll(pagination);


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
