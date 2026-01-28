import { OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
export declare class PrismaService extends PrismaClient implements OnModuleDestroy {
    private _configService;
    private clients;
    constructor(_configService: ConfigService);
    onModuleDestroy(): Promise<void>;
    get client(): PrismaClient;
}
