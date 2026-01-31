import { ConfigService } from '@nestjs/config';
export declare class MailService {
    private readonly _configService;
    private transporter;
    constructor(_configService: ConfigService);
    private sendMail;
    sendTemporaryPassword(email: string, name: string, temporaryPassword: string): Promise<boolean>;
    sendOtp(email: string, code: string): Promise<boolean>;
}
