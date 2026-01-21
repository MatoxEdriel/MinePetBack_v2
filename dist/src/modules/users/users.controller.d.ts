import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
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
    getProfile(req: any): {
        message: string;
        user: any;
    };
    changePassword(req: any, newPassword: string): Promise<import("../auth/dto/login.dto").UserValidated>;
}
