import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

import * as bcrypt from 'bcrypt';
import { LoginAuthDto, UserValidated } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {


  constructor(
    private readonly userServices: UsersService,
    private jwtService: JwtService,
  ) {
  }

  async validateUser(payload: { user_name: string, pass: string }): Promise<any> {

    const user = await this.userServices.findByUserName(payload.user_name);
    if (user && (await bcrypt.compare(payload.pass, user.password))) {

      //Separamos responsabilidad es decir la contraseña aparte para que cuando se cree el jwt no este la contraseña
      const { password, ...result } = user;

      return result;
    }
    //poner validaciones 
  }


  async login(user: UserValidated) {
    const payload = {
      username: user.user_name,
      sub: user.id,
    };
    return {
      access_token: this.jwtService.sign(payload),
      first_login: user.first_login,
      user: {
        id: user.id,
        user_name: user.user_name
      }
    };
  }








  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }



  remove(id: number) {
    return `This action removes a #${id} auth`;
  }




}
