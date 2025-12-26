import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UsersService } from '../users/users.service';
export declare class AuthService {
    private readonly userServices;
    constructor(userServices: UsersService);
    validateUser(payload: {
        user_name: string;
        pass: string;
    }): Promise<any>;
    create(createAuthDto: CreateAuthDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateAuthDto: UpdateAuthDto): string;
    remove(id: number): string;
}
