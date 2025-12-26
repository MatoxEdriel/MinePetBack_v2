import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UsersService } from '../users/users.service';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {


  constructor(
    private readonly userServices: UsersService
  ) {



  }

  async validateUser(payload: { email: string, pass: string }): Promise<any> {

    const user: any  = await this.userServices.findOneByEmail(payload.email);
    if (user && (await bcrypt.compare(payload.pass, user.password))) {

      const { password, ...result } = user;

      return result;
    }






  }


  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }




}
