import { UsersService } from '../users/users.service';
import { UserValidated } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly userServices;
    private jwtService;
    constructor(userServices: UsersService, jwtService: JwtService);
    validateUser(payload: {
        user_name: string;
        pass: string;
    }): Promise<any>;
    login(user: UserValidated): Promise<{
        access_token: string;
        first_login: boolean | undefined;
        user: {
            id: number;
            user_name: string;
        };
    }>;
    findAll(): string;
    findOne(id: number): string;
    remove(id: number): string;
}
