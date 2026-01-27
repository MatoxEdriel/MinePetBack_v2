import { OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
export declare class PrismaService extends PrismaClient implements OnModuleInit {
    private clients;
    get client(): PrismaClient;
    constructor();
    onModuleInit(): Promise<void>;
}
