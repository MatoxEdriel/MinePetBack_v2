"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const transform_interceptor_1 = require("./core/interceptor/transform.interceptor");
const http_exception_filter_1 = require("./core/filter/http-exception.filter");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    const config = new swagger_1.DocumentBuilder()
        .setTitle('TechFix Api')
        .setDescription('Documentacion de la API')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const configService = app.get(config_1.ConfigService);
    const port = configService.get('PORT') || 3000;
    const corsOrigin = configService.get('CORS_ORIGIN') || '*';
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    app.enableCors({
        origin: corsOrigin,
        credentials: true
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.useGlobalInterceptors(new transform_interceptor_1.TransformInterceptor());
    app.useGlobalFilters(new http_exception_filter_1.AllExceptionsFilter());
    app.getHttpAdapter().get('/', (req, res) => {
        res.redirect('/api');
    });
    await app.listen(port);
    swagger_1.SwaggerModule.setup('api', app, document);
    console.log(`Server up by ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map