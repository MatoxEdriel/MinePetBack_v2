import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

import * as bcrypt from 'bcrypt';
import { LoginAuthDto, UserValidated } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/PrismaService.service';
import { MailService } from '../business/mail/mail.service';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AuthService {


  constructor(
    private readonly userServices: UsersService,
    private jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly emailService: MailService,
    private readonly configService: ConfigService
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


  async resetPasswordWithToken(userId: number, newPass: string) {

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPass, salt);

    await this.userServices.updatePassword(userId, hash);
    return {
      message: 'Contraseña actualizada exitosamente'
    }
  }


  async verifyOtpGetToken(email: string, codeInput: string) {

    const user = await this.userServices.findByEmail(email);


    const storedReset = await this.prismaService.password_resets.findFirst({
      where: { user_id: user.id }
    });


    //Expiracion 
    if (new Date() > storedReset!.expires_at) {

      throw new BadRequestException('El codigo ha expirado');


    }

    //aqui validamos xd

    const isValid = await bcrypt.compare(codeInput, storedReset!.token_hash);

    if (!isValid) {
      throw new BadRequestException('Codigo incorrecto')
    }

    const recoverySecret = this.configService.get<string>('JWT_RECOVERY_SECRET');
    const recoveryExpires = this.configService.get<string>('JWT_RECOVERY_EXPIRES_IN');


    if (!recoverySecret || !recoveryExpires) {
      throw new Error('Variables de entorno JWT_RECOVERY faltantes');
    }

    const payload = {
      sub: user.id.toString(),
      action: 'reset_password'

    }


    //todo cambiar el secretkey y la duracion para que sea corta el token para hacer!!! 


    const recoveryToken = this.jwtService.sign(payload, { secret: recoverySecret, expiresIn: recoveryExpires as any })

    //!RECORDAR LE PUEDES PASAR COMO PARTE DE JWT. y la firma pues para que se va a usar dentro del action  reset_password

    await this.prismaService.password_resets.delete({ where: { id: storedReset!.id } })


    return { recoveryToken }


  }


  async sendRecoveryCode(email: string) {
    const user = await this.userServices.findByEmail(email);

    if (!user) {
      return {
        message: 'Si el correo existe en nuestro sistema, recibiras un codigo en breve'
      }

    }

    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const hash = await bcrypt.hash(code, 10);

    await this.prismaService.$transaction([
      this.prismaService.password_resets.deleteMany(
        { where: { user_id: user.id } }),


      this.prismaService.password_resets.create({
        data: {
          user_id: user.id,
          token_hash: hash,
          expires_at: new Date(Date.now() + 10 * 60 * 1000)
        }
      })
    ]);
    const sentOtp = await this.emailService.sendOtp(email, code);
    return {
      message: 'Si el correo existe en nuestro sistema, recibiras un codigo en breve'
    }
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
