"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantMiddleware = void 0;
const common_1 = require("@nestjs/common");
const PrismaService_service_1 = require("../../prisma/PrismaService.service");
const tenant_storage_1 = require("../interfaces/tenant-storage");
let TenantMiddleware = class TenantMiddleware {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async use(req, res, next) {
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
                throw new common_1.UnauthorizedException(`Su empresa no esta registrada ${tenantSlug}`);
            }
        }
        console.log(` Petición recibida para el tenant: ${tenantSchema}`);
        console.log(` Dominio: ${tenantSlug}`);
        tenant_storage_1.tenantStorage.run(tenantSlug, () => next());
    }
};
exports.TenantMiddleware = TenantMiddleware;
exports.TenantMiddleware = TenantMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [PrismaService_service_1.PrismaService])
], TenantMiddleware);
//# sourceMappingURL=tenant.middleware.js.map