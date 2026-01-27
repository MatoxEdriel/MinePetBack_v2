
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { tenantStorage } from 'src/interfaces/tenant-storage';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {

    const host = req.headers.host;

    const tenantSchema = host!.split('.')[0];
    console.log(`🚀 Petición recibida para el tenant: ${tenantSchema}`);
    tenantStorage.run(tenantSchema, () => next())
  }
}
