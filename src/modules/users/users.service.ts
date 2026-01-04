import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'prisma/PrismaService.service';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

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

  async updateFirstPassword(userId: number, newPass: string) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPass, salt);

    return this.prisma.users.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        first_login: false,
      },
    });
  }

  


  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
