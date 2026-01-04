import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'prisma/PrismaService.service';
import { UserValidated } from '../auth/dto/login.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto): Promise<{
        temporaryPassword: string;
        persons: {
            id: number;
            name: string | null;
            type_id: number | null;
            last_name: string | null;
            email: string | null;
            birthday_day: Date | null;
            phone: string | null;
            address: string | null;
        } | null;
        user_name: string | null;
        id: number;
        person_id: number | null;
        created_at: Date | null;
        updated_at: Date | null;
        user_created: string | null;
        deleted_at: Date | null;
        first_login: boolean | null;
        attempts: number | null;
    }>;
    findAll(): string;
    findByUserName(username: string): Promise<any | null>;
    updatePassword(userId: number, hashedPassword: string): Promise<UserValidated>;
}
