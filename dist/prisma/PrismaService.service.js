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
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const tenant_storage_1 = require("../src/interfaces/tenant-storage");
const config_1 = require("@nestjs/config");
let PrismaService = class PrismaService extends client_1.PrismaClient {
    _configService;
    clients = new Map();
    constructor(_configService) {
        const dbUrl = _configService.get('DATABASE_URL');
        if (!dbUrl) {
            throw new Error('Database url no encontrada');
        }
        const pool = new adapter_pg_1.PrismaPg({ connectionString: dbUrl });
        super({ adapter: pool });
        this._configService = _configService;
    }
    async onModuleDestroy() {
        for (const client of this.clients.values()) {
            await client.$disconnect();
        }
    }
    get client() {
        const schema = tenant_storage_1.tenantStorage.getStore();
        const currentSchema = schema || 'public';
        if (!this.clients.has(currentSchema)) {
            const databaseUrl = this._configService.get('DATABASE_URL');
            if (!databaseUrl) {
                throw new Error('Database not defined en el archivo .env');
            }
            const newClient = new client_1.PrismaClient({
                datasource: {
                    db: {
                        url: `${databaseUrl}?schema=${currentSchema}`
                    },
                }
            });
            this.clients.set(currentSchema, newClient);
        }
        return this.clients.get(currentSchema);
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PrismaService);
//# sourceMappingURL=PrismaService.service.js.map