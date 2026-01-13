/*
https://docs.nestjs.com/interceptors#interceptors
*/

import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

//!Repasar tap que hace 

//! interceptor para verifica de lo que se envia se envia bien  
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {





    return next
      //handle()  esto devuelve un observable (flujo de dato) es decir lo que el controlador retorno o da 
      .handle()
      .pipe(

        map((data) => {
          //context es el entorno general de la ejecucion 
          //con eso lee la response y lo cambia a http  y con eso tienes lo metodos  
          const ctx = context.switchToHttp();

          const response = ctx.getResponse();
          //!por eso aqui ya puedes usar el getResposne  

          //! y manejar el codigo y mensajes 
          const statusCode = response.statusCode;

          const message = data?.message || 'Operation Successful';

          let finalData = data;


          //! verificacion de object o mensaje typeof desde un string xd 
          if (data && typeof data === 'object' && 'message' in data) {
            //? esta validacion es para no repetir las respuesta
            //Verifica que data sea un objeto real o un mensaje tipo usado para cosas como envio de correo etc 
            //verificadmos ue el objeto tiene propiedad llamada message. 
            const { message: msg, ...rest } = data;

            finalData = Object.keys(rest).length > 0 ? rest : null;

          }

          return {
            statusCode,
            message,
            data: finalData,
            error: null



          }





        }



        )




      );
  }
}
