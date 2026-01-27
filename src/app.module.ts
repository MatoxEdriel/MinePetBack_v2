import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './core/filter/http-exception.filter';
import { MenuController } from './modules/menu/menu.controller';
import { MenuService } from './modules/menu/menu.service';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { MailModule } from './modules/business/mail/mail.module';
import { TenantMiddleware } from './core/tenant.middleware';

@Module({
  imports: [


    PrismaModule,
    AuthModule,
    UsersModule

    ,
    ConfigModule.forRoot({
      isGlobal: true


    }),




  ],
  controllers: [
    MenuController, AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    MenuService, AppService],
})
export class AppModule implements NestModule {

  //? consiguracion de middleware 
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL })

  }
}
