import { Module } from '@nestjs/common';
import { GradingController } from './grading.controller';
import { GradingService } from './grading.service';
import { ResponseModule } from 'src/common/response/response.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grading } from './entities/grading.entity';
import { HttpModule } from '@nestjs/axios';
import { SubmissionModule } from 'src/submissions/submission.module';

@Module({
    imports: [
        ResponseModule,
        TypeOrmModule.forFeature([Grading]),
        HttpModule.register({
            // timeout: 5000, // 5초 이상 응답 없으면 타임아웃 시키기
            // maxRedirects: 5, // 최대 5번 리다이렉트
        }),
        SubmissionModule,
    ],
    controllers: [GradingController],
    providers: [GradingService],
    exports: [GradingService],
})
export class GradingModule {}
