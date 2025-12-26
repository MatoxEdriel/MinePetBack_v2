import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginAuthDto, req: any): Promise<{
        access_token: string;
        first_login: boolean | undefined;
        user: {
            id: number;
            user_name: string;
        };
    }>;
}
