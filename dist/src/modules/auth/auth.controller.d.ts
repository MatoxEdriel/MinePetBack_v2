import { AuthService } from './auth.service';
import { ChangePasswordDto, LoginAuthDto } from './dto/login.dto';
import { MailService } from '../business/mail/mail.service';
export declare class AuthController {
    private readonly mailService;
    private readonly authService;
    constructor(mailService: MailService, authService: AuthService);
    login(loginDto: LoginAuthDto, req: any): Promise<{
        access_token: string;
        first_login: boolean | undefined;
        user: {
            id: number;
            user_name: string | null;
            fullName: string;
            roles: string[];
            rolesIds: number[];
        };
    }>;
    changePassword(req: any, changePassDto: ChangePasswordDto): Promise<{
        access_token: string;
        first_login: boolean | undefined;
        user: {
            id: number;
            user_name: string | null;
            fullName: string;
            roles: string[];
            rolesIds: number[];
        };
    }>;
    sendCode(email: string): Promise<{
        message: string;
    }>;
}
