import { UsersService } from '../users/users.service';
import { UserValidated } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/PrismaService.service';
import { MailService } from '../business/mail/mail.service';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private readonly userServices;
    private jwtService;
    private readonly prismaService;
    private readonly emailService;
    private readonly configService;
    constructor(userServices: UsersService, jwtService: JwtService, prismaService: PrismaService, emailService: MailService, configService: ConfigService);
    validateUser(payload: {
        user_name: string;
        pass: string;
    }): Promise<any>;
    login(user: UserValidated): Promise<{
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
    changePassword(userId: number, newPass: string): Promise<{
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
    resetPasswordWithToken(userId: number, newPass: string): Promise<{
        message: string;
    }>;
    verifyOtpGetToken(email: string, codeInput: string): Promise<{
        recoveryToken: string;
    }>;
    sendRecoveryCode(email: string): Promise<{
        message: string;
    }>;
    findAll(): string;
    findOne(id: number): string;
    remove(id: number): string;
}
