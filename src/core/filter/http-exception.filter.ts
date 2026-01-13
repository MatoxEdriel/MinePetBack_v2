/*
https://docs.nestjs.com/exception-filters#exception-filters-1
*/

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

//esto indica que atrapa cualquier error por ahora no vamos a especificar podriamos aprovechar eso 
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;


    const exceptionResponse: any =
      exception instanceof HttpException ? exception.getResponse() : { message: 'Internal server error' };


    const errorMessage = typeof exceptionResponse === 'string' ? exceptionResponse : (exceptionResponse.message || exceptionResponse.error || 'Internal server error');

    const finalError = Array.isArray(errorMessage)
      ? errorMessage.join(', ')
      : errorMessage;



    const responseBody = {
      statusCode: status,
      message: 'Operation failer',
      data: null,
      error: finalError


    }

    response.status(status).json(responseBody);

    console.error(`Error en ${request.url}:`, exception);


  }
}
