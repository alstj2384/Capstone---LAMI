import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    const config = new DocumentBuilder().setTitle('Review').setDescription('NestJS Review Swagger 문서').setVersion('1.0').build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api/api-docs', app, document);

    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

    // app.enableCors({
    //     origin: ['http://localhost:3000', 'http://localhost:3001'],
    //     methods: ['GET,HEAD,PUT,PATCH,POST,DELETE'],
    //     credentials: true,
    //     // preflightContinue: false,
    // });
    app.enableCors({
        origin: true,
        methods: '*',
        credentials: true,
    });
    await app.listen(3001);
}
bootstrap();
