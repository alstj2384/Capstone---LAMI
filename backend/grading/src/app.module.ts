import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GradingModule } from './grading/grading.module';
import { ResponseModule } from './common/response/response.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/exceptions.filter';
import { SubmissionModule } from './submissions/submission.module';

import databaseConfig from './common/configuration/database/database.config';
import { Grading } from './grading/entities/grading.entity';
import { Submission } from './submissions/entities/submission.entity';

// console.log(`.env.${process.env.NODE_ENV}`);

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
            load: [databaseConfig],
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'mariadb',
                host: configService.get('database.host'),
                port: configService.get('database.port'),
                username: configService.get('database.username'),
                password: configService.get('database.password'),
                database: configService.get('database.database'),
                entities: [Grading, Submission],
                synchronize: false,
                timezone: '+09:00',
            }),
        }),
        GradingModule,
        ResponseModule,
        SubmissionModule,
    ],
    controllers: [],
    providers: [
        {
            provide: APP_FILTER,
            useClass: AllExceptionsFilter,
        },
    ],
})
export class AppModule {}
