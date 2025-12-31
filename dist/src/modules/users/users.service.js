"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const PrismaService_service_1 = require("../../../prisma/PrismaService.service");
const bcrypt = __importStar(require("bcrypt"));
const crypto_1 = require("crypto");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createUserDto) {
        const temporaryPassword = (0, crypto_1.randomBytes)(4).toString('hex');
        const existingUser = await this.prisma.users.findFirst({
            where: { user_name: createUserDto.user_name },
        });
        const existingPerson = await this.prisma.persons.findFirst({
            where: { email: createUserDto.email },
        });
        if (existingUser || existingPerson) {
            throw new common_1.BadRequestException('El usuario o el correo ya están registrados');
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(temporaryPassword, salt);
        const newUser = await this.prisma.users.create({
            data: {
                user_name: createUserDto.user_name,
                password: hashedPassword,
                user_created: 'SISTEMA',
                first_login: true,
                persons: {
                    create: {
                        name: createUserDto.name,
                        last_name: createUserDto.last_name,
                        email: createUserDto.email,
                        phone: createUserDto.phone,
                        address: createUserDto.address,
                        birthday_day: createUserDto.birthday_day ? new Date(createUserDto.birthday_day) : null,
                        type_id: createUserDto.type_id,
                    },
                },
                user_roles: {
                    create: [
                        {
                            role_id: Number(createUserDto.role_id)
                        }
                    ]
                }
            },
            include: {
                persons: true,
            },
        });
        const { password, ...result } = newUser;
        return {
            ...result,
            temporaryPassword,
        };
    }
    findAll() {
        return `This action returns all users`;
    }
    async findByUserName(username) {
        return this.prisma.users.findFirst({
            where: { user_name: username },
            include: {
                persons: true,
                user_roles: {
                    include: {
                        roles: true
                    }
                }
            }
        });
    }
    async updateFirstPassword(userId, newPass) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPass, salt);
        return this.prisma.users.update({
            where: { id: userId },
            data: {
                password: hashedPassword,
                first_login: false,
            },
        });
    }
    update(id, updateUserDto) {
        return `This action updates a #${id} user`;
    }
    remove(id) {
        return `This action removes a #${id} user`;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [PrismaService_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map