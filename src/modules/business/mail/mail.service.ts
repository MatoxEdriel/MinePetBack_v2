import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { dmmfToRuntimeDataModel } from '@prisma/client/runtime/client';
import { get } from 'http';
import * as nodemailer from 'nodemailer';
import { Subject } from 'rxjs';

@Injectable()
export class MailService {

    //!Concepto de transporter.  
    //!Motor de envio de correos es el objeto que conoce todo el como, desde donde y el con que se envia correo 
    private transporter;

    //Todo implementar la posibilidade poner otros servicios de AWS SES y esperar las optimizacions y codigo 


    //!contraseña de aplicaciones 
    constructor(
        private readonly _configService: ConfigService

    ) {

        this.transporter = nodemailer.createTransport({

            //? investigar concepto dede SMTP, repasar  y tambien averiguar si se necesita pagar algo para esto 
            host: this._configService.get<string>('HOST_EMAIL'),
            port: this._configService.get<number>('PORT_EMAIL'),
            secure: true,
            auth: {
                user: this._configService.get<string>('USER_EMAIL'),
                pass: this._configService.get<string>('PASS_EMAIL'),
            }
        })
    }


    private async sendMail(
        to: string,
        subject: string,
        html: string,
    ): Promise<boolean> {

        await this.transporter.sendMail({
            from: "'Bienvenido a la familia MinePet'",
            to,
            subject,
            html
        });

        return true;

    }

    async sendTemporaryPassword(
        email: string,
        name: string,
        temporaryPassword: string
    ): Promise<boolean> {

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
        return this.sendMail(
            email,
            'Bienvenido a la familia MinePet -Contraseña Temporal',
            html
        );
    }


    async sendOtp(email: string, code: string) {
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


}


