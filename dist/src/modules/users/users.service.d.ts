import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'prisma/PrismaService.service';
import { UserValidated } from '../auth/dto/login.dto';
import { IUser } from './interfaces/users.interface';
import { PaginatedResponse, PaginationDto } from 'src/interfaces/pagination.interface';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto): Promise<{
        temporaryPassword: string;
        persons: {
            id: number;
            name: string | null;
            last_name: string | null;
            email: string | null;
            birthday_day: Date | null;
            phone: string | null;
            address: string | null;
            type_id: number | null;
        } | null;
        id: number;
        person_id: number | null;
        user_name: string | null;
        created_at: Date | null;
        updated_at: Date | null;
        user_created: string | null;
        deleted_at: Date | null;
        first_login: boolean | null;
        attempts: number | null;
        company: number | null;
    }>;
    findAll(): string;
    getAll(pagination: PaginationDto): Promise<PaginatedResponse<IUser>>;
    findByEmail(email: string): Promise<any | null>;
    findByUserName(username: string): Promise<any | null>;
    updatePassword(userId: number, hashedPassword: string): Promise<UserValidated>;
}
