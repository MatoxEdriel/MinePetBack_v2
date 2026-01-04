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
  }



  async login(user: UserValidated) {
    const roles = user.user_roles.map((ur) => ur.roles.name);
    const rolesIds = user.user_roles.map((ur) => ur.roles.id)
    const payload = {
      username: user.user_name,
      sub: user.id,
      roles: roles,
      roleIds: rolesIds
    };
    return {
      access_token: this.jwtService.sign(payload),
      first_login: user.first_login,
      user: {
        id: user.id,
        user_name: user.user_name,
        fullName: user.persons ? `${user.persons.name} ${user.persons.last_name}` : '',
        roles: roles,
        rolesIds: rolesIds
      }
    };
  }


  //!First login y cambio voluntario de dde contraseña 

  async changePassword(userId: number, newPass: string) {

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPass, salt);

    const userUpdate = await this.userServices.updatePassword(userId, hash)

    if (!userUpdate) {
      throw new Error('Error al actualizar el usuario');
    }


    return this.login(userUpdate)


  }


  //Este es para el cambio de contrasela con codigo OTP y correo
  // async resetPasswordwithOTP(email: string, otpCode: string, newPass: string){

  //   const isCodeValid = await this.va






  // }



  //todo IMPLEMENTAR DOBLE verificacion de dos casos de uso 



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
