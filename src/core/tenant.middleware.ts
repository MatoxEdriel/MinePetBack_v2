
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { PrismaService } from 'prisma/PrismaService.service';
import { tenantStorage } from 'src/interfaces/tenant-storage';

@Injectable()
export class TenantMiddleware implements NestMiddleware {


  constructor(private readonly prisma: PrismaService) { }


  async use(req: Request, res: Response, next: NextFunction) {

    const host = req.headers.host || '';



    const tenantSchema = host.split('.');

    const tenantSlug = tenantSchema.length >= 2 ? tenantSchema[0] : 'public';


    if (tenantSlug !== 'public' && tenantSlug !== 'localhost') {

      const tenant = await this.prisma.tenants.findFirst({

        where: {
          domain: tenantSlug
        }



      });

      if (!tenant) {
        throw new UnauthorizedException(`Su empresa no esta registrada ${tenantSlug}`)
      }

    }


    console.log(` Petición recibida para el tenant: ${tenantSchema}`);
    console.log(` Dominio: ${tenantSlug}`);
    tenantStorage.run(tenantSlug, () => next())
  }
}
