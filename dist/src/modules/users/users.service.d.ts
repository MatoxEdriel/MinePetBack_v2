import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'prisma/PrismaService.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto): Promise<{
        temporaryPassword: string;
        persons: {
            name: string | null;
            last_name: string | null;
            email: string | null;
            type_id: number | null;
            birthday_day: Date | null;
            phone: string | null;
            address: string | null;
            id: number;
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
    updateFirstPassword(userId: number, newPass: string): Promise<{
        user_name: string | null;
        id: number;
        person_id: number | null;
        password: string | null;
        created_at: Date | null;
        updated_at: Date | null;
        user_created: string | null;
        deleted_at: Date | null;
        first_login: boolean | null;
        attempts: number | null;
    }>;
    update(id: number, updateUserDto: UpdateUserDto): string;
    remove(id: number): string;
}
