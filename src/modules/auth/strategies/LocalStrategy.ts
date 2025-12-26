//!loCAL STRATEGY es una strategia del COMO se autenticara el usuario 

import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "../auth.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Strategy } from "passport-local";

//Con esto puedes cambiar la strategia de como iniciar sesion y pues podrias importa
//esto y al importarlo peudes  hacer validaciones OJO cada autenticacion seria una clase 

//!esta libreria entonces transofmra la venida de dato en datos mas limpios para hacer dichas validaciones 
//? Este se encarga de funcionar como un intermediario es decir aqui podre validarlo sin embeargo 
//Se importo le clase de passportstrategy 
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

    constructor(private authService: AuthService) {
        super({
            //aqui tu le dices mira aqui buscate esos especifico para que no traigas la data basura de request 
            //se refiere basura como tipos de datos innecsario en este caso created_at quizas aqui 
            //valida si noe s string verifica si manda un numero de un texto etc 
            usernameField: 'user_name',
            passwordField: 'pass',
        } as any);
    }


    async validate(user_name: string, pass: string): Promise<any> {

        const user = await this.authService.validateUser({ user_name, pass });

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }







}