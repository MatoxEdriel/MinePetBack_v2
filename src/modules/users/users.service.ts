import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'prisma/PrismaService.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {


  constructor(private prisma: PrismaService) { }



  async create(createUserDto: CreateUserDto) {
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
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt)
    const newUser = await this.prisma.users.create({
      data: {
        user_name: createUserDto.user_name,
        password: hashedPassword,
        user_created: 'SISTEMA',

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
      },
      include: {
        persons: true,
      },
    });

    const { password, ...result } = newUser;
    return result;



  }

  findAll() {
    return `This action returns all users`;
  }


  async findByUserName(username: string): Promise<any | null> {



    return this.prisma.users.findFirst({ where: { user_name: username } });

  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
