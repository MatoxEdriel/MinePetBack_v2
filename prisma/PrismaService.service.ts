
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { tenantStorage } from 'src/interfaces/tenant-storage';
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {

  //primero traemos  los clientes los tenant

  private clients: Map<string, PrismaClient> = new Map();



  get client(): PrismaClient {
    const schema = tenantStorage.getStore();

    const currentSchema = schema || 'public';

    if (!this.clients.has(currentSchema)) {
      const newClient = new PrismaClient({
        datasources: {
          db: {
            url: `${process.env.DATABASE_URL}?schema=${currentSchema}`,
          },
        },
      } as any);

      this.clients.set(currentSchema, newClient);
    }

    return this.clients.get(currentSchema)!;
  }




  constructor() {
    const pool = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
    super({ adapter: pool });
  }


  async onModuleInit() {
    await this.$connect();
  }



}