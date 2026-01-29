import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { PaginationDto } from 'src/interfaces/pagination.interface';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    register(createUserDto: CreateUserDto): Promise<{
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
    getAll(pagination: PaginationDto): Promise<import("src/interfaces/pagination.interface").PaginatedResponse<import("./interfaces/users.interface").IUser>>;
    getProfile(req: any): {
        message: string;
        user: any;
    };
    changePassword(req: any, newPassword: string): Promise<import("../auth/dto/login.dto").UserValidated>;
}
