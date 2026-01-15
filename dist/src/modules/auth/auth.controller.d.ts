import { AuthService } from './auth.service';
import { ChangePasswordDto, LoginAuthDto } from './dto/login.dto';
import { MailService } from '../business/mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export declare class AuthController {
    private readonly mailService;
    private readonly authService;
    private readonly jwtService;
    private readonly configService;
    constructor(mailService: MailService, authService: AuthService, jwtService: JwtService, configService: ConfigService);
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
    resetPassword(newPass: string, authHeader: string): Promise<{
        message: string;
    }>;
    sendCode(email: string): Promise<{
        message: string;
    }>;
    verifyCode(body: {
        email: string;
        code: string;
    }): Promise<{
        recoveryToken: string;
    }>;
}
