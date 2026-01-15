import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'prisma/PrismaService.service';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { UserValidated } from '../auth/dto/login.dto';

@Injectable()
export class UsersService {


  constructor(private prisma: PrismaService) { }
  async create(createUserDto: CreateUserDto) {

    const temporaryPassword = randomBytes(4).toString('hex');
    const existingUser = await this.prisma.users.findFirst({
      where: { user_name: createUserDto.user_name },
    });
    const existingPerson = await this.prisma.persons.findFirst({
      where: { email: createUserDto.email },
    });
    if (existingUser || existingPerson) {
      throw new BadRequestException('El usuario o el correo ya están registrados');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(temporaryPassword, salt)



    const newUser = await this.prisma.users.create({
      data: {
        user_name: createUserDto.user_name,
        password: hashedPassword,
        user_created: 'SISTEMA',
        first_login: true,

        persons: {
          create: {
            name: createUserDto.name,
            last_name: createUserDto.last_name,
            email: createUserDto.email,
            phone: createUserDto.phone,
            address: createUserDto.address,
            birthday_day: createUserDto.birthday_day ? new Date(createUserDto.birthday_day) : null,
            type_id: createUserDto.type_id,
          },
        },

        user_roles: {
          create: [
            {
              role_id: Number(createUserDto.role_id)
            }
          ]

        }

      },
      include: {
        persons: true,
      },
    });

    const { password, ...result } = newUser;
    return {
      ...result,
      temporaryPassword,
    };


  }

  findAll() {
    return `This action returns all users`;
  }


  getAll() {






  }

  async findByEmail(email: string): Promise<any | null> {
    const user = await this.prisma.users.findFirst({
      where: {
        persons: {
          email: email
        }
      },
      include: {
        persons: true
      }
    });
    return user;
  }

  async findByUserName(username: string): Promise<any | null> {
    return this.prisma.users.findFirst({
      where: { user_name: username },
      include: {
        persons: true,
        user_roles: {
          include: {
            roles: true
          }
        }
      }
    });

  }



  async updatePassword(userId: number, hashedPassword: string): Promise<UserValidated> {
    const user = await this.prisma.users.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        first_login: false,
      },

      include: {

        persons: true,
        user_roles: {
          include: {
            roles: true
          }
        }

      }
    });
    const userValidated: UserValidated = {
      id: user.id,
      user_name: user.user_name,
      first_login: user.first_login ?? false,

      persons: user.persons ? {
        name: user.persons.name ?? '',
        last_name: user.persons.last_name ?? '',
        email: user.persons.email ?? ''
      } : null,

      role: user.user_roles.length > 0 ? user.user_roles[0].roles.id : 0,

      user_roles: user.user_roles.map(ur => ({
        roles: {
          id: ur.roles.id,
          name: ur.roles.name ?? ''
        }
      }))
    };

    return userValidated;
  }


}






