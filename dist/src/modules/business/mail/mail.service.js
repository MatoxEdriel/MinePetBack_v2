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
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = __importStar(require("nodemailer"));
let MailService = class MailService {
    _configService;
    transporter;
    constructor(_configService) {
        this._configService = _configService;
        this.transporter = nodemailer.createTransport({
            host: this._configService.get('HOST_EMAIL'),
            port: this._configService.get('PORT_EMAIL'),
            secure: true,
            auth: {
                user: this._configService.get('USER_EMAIL'),
                pass: this._configService.get('PASS_EMAIL'),
            }
        });
    }
    async sendMail(to, subject, html) {
        await this.transporter.sendMail({
            from: "'Bienvenido a la familia MinePet'",
            to,
            subject,
            html
        });
        return true;
    }
    async sendTemporaryPassword(email, name, temporaryPassword) {
        const html = `
    <div style="
      font-family: Arial, Helvetica, sans-serif;
      background-color: #fdf2f8;
      padding: 30px;
    ">
      <div style="
        max-width: 480px;
        margin: auto;
        background-color: #ffffff;
        border-radius: 10px;
        padding: 25px;
        text-align: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      ">

        <h2 style="color:#be185d;">
          ¡Bienvenido a MinePet! 🐾
        </h2>

        <p style="color:#444; font-size:14px;">
          Hola <b>${name}</b>, tu cuenta ha sido creada correctamente.
        </p>

        <p style="margin-top:20px;">
          Tu contraseña temporal es:
        </p>

        <div style="
          background-color:#fce7f3;
          border:2px dashed #be185d;
          padding:15px;
          border-radius:8px;
          margin:20px 0;
        ">
          <span style="
            font-size:28px;
            font-weight:bold;
            letter-spacing:4px;
            color:#9d174d;
          ">
            ${temporaryPassword}
          </span>
        </div>

        <p style="font-size:13px; color:#555;">
          Por seguridad, deberás cambiar esta contraseña
          al iniciar sesión por primera vez.
        </p>

        <hr style="margin:25px 0; border:none; border-top:1px solid #fbcfe8;" />

        <p style="font-size:12px; color:#9d174d;">
          Equipo MinePet 
        </p>

      </div>
    </div>
  `;
        return this.sendMail(email, 'Bienvenido a la familia MinePet -Contraseña Temporal', html);
    }
    async sendOtp(email, code) {
        const html = `
    <div style="
      font-family: Arial, Helvetica, sans-serif;
      background-color: #fdf2f8;
      padding: 30px;
    ">
      <div style="
        max-width: 480px;
        margin: auto;
        background-color: #ffffff;
        border-radius: 10px;
        padding: 25px;
        text-align: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      ">
        
        <h2 style="
          color: #be185d;
          margin-bottom: 10px;
        ">
          Recuperación de contraseña
        </h2>

        <p style="
          color: #444;
          font-size: 14px;
          margin-bottom: 20px;
        ">
          Usa el siguiente código para continuar con la recuperación de tu cuenta:
        </p>

        <div style="
          background-color: #fce7f3;
          border: 2px dashed #be185d;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
        ">
          <span style="
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 6px;
            color: #9d174d;
          ">
            ${code}
          </span>
        </div>

        <p style="
          font-size: 12px;
          color: #666;
        ">
          Este código expirará en <b>10 minutos</b>.<br>
          Si no solicitaste este cambio, ignora este correo.
        </p>

        <hr style="margin: 25px 0; border: none; border-top: 1px solid #fbcfe8;" />

        <p style="
          font-size: 12px;
          color: #9d174d;
        ">
          Equipo MinePet
        </p>
      </div>
    </div>
  `;
        return this.sendMail(email, 'Código de recuperación', html);
    }
};
exports.MailService = MailService;
exports.MailService = MailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailService);
//# sourceMappingURL=mail.service.js.map