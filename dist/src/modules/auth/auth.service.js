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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const bcrypt = __importStar(require("bcrypt"));
const jwt_1 = require("@nestjs/jwt");
const PrismaService_service_1 = require("../../../prisma/PrismaService.service");
const mail_service_1 = require("../business/mail/mail.service");
const config_1 = require("@nestjs/config");
let AuthService = class AuthService {
    userServices;
    jwtService;
    prismaService;
    emailService;
    configService;
    constructor(userServices, jwtService, prismaService, emailService, configService) {
        this.userServices = userServices;
        this.jwtService = jwtService;
        this.prismaService = prismaService;
        this.emailService = emailService;
        this.configService = configService;
    }
    async validateUser(payload) {
        const user = await this.userServices.findByUserName(payload.user_name);
        if (user && (await bcrypt.compare(payload.pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
    }
    async login(user) {
        const roles = user.user_roles.map((ur) => ur.roles.name);
        const rolesIds = user.user_roles.map((ur) => ur.roles.id);
        const payload = {
            username: user.user_name,
            sub: user.id,
            roles: roles,
            roleIds: rolesIds
        };
        return {
            access_token: this.jwtService.sign(payload),
            first_login: user.first_login,
            user: {
                id: user.id,
                user_name: user.user_name,
                fullName: user.persons ? `${user.persons.name} ${user.persons.last_name}` : '',
                roles: roles,
                rolesIds: rolesIds
            }
        };
    }
    async changePassword(userId, newPass) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newPass, salt);
        const userUpdate = await this.userServices.updatePassword(userId, hash);
        if (!userUpdate) {
            throw new Error('Error al actualizar el usuario');
        }
        return this.login(userUpdate);
    }
    async resetPasswordWithToken(userId, newPass) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newPass, salt);
        await this.userServices.updatePassword(Number(userId), hash);
        return {
            message: 'Contraseña actualizada exitosamente'
        };
    }
    async verifyOtpGetToken(email, codeInput) {
        const user = await this.userServices.findByEmail(email);
        const storedReset = await this.prismaService.password_resets.findFirst({
            where: { user_id: user.id }
        });
        if (new Date() > storedReset.expires_at) {
            throw new common_1.BadRequestException('El codigo ha expirado');
        }
        const isValid = await bcrypt.compare(codeInput, storedReset.token_hash);
        if (!isValid) {
            throw new common_1.BadRequestException('Codigo incorrecto');
        }
        const recoverySecret = this.configService.get('JWT_RECOVERY_SECRET');
        const recoveryExpires = this.configService.get('JWT_RECOVERY_EXPIRES_IN');
        if (!recoverySecret || !recoveryExpires) {
            throw new Error('Variables de entorno JWT_RECOVERY faltantes');
        }
        const payload = {
            sub: user.id.toString(),
            action: 'reset_password'
        };
        const recoveryToken = this.jwtService.sign(payload, { secret: recoverySecret, expiresIn: recoveryExpires });
        await this.prismaService.password_resets.delete({ where: { id: storedReset.id } });
        return { recoveryToken };
    }
    async sendRecoveryCode(email) {
        const user = await this.userServices.findByEmail(email);
        if (!user) {
            return {
                message: 'Si el correo existe en nuestro sistema, recibiras un codigo en breve'
            };
        }
        const code = Math.floor(1000 + Math.random() * 9000).toString();
        const hash = await bcrypt.hash(code, 10);
        await this.prismaService.$transaction([
            this.prismaService.password_resets.deleteMany({ where: { user_id: user.id } }),
            this.prismaService.password_resets.create({
                data: {
                    user_id: user.id,
                    token_hash: hash,
                    expires_at: new Date(Date.now() + 10 * 60 * 1000)
                }
            })
        ]);
        const sentOtp = await this.emailService.sendOtp(email, code);
        return {
            message: 'Si el correo existe en nuestro sistema, recibiras un codigo en breve'
        };
    }
    findAll() {
        return `This action returns all auth`;
    }
    findOne(id) {
        return `This action returns a #${id} auth`;
    }
    remove(id) {
        return `This action removes a #${id} auth`;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        PrismaService_service_1.PrismaService,
        mail_service_1.MailService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map