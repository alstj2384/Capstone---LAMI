import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { ResponseModule } from 'src/common/response/response.module';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [
        TypeOrmModule.forFeature([Review]),
        ResponseModule,
        HttpModule.register({
            timeout: 5000, // 5초 이상 응답 없으면 타임아웃 시키기
            maxRedirects: 5, // 최대 5번 리다이렉트
        }),
    ],
    providers: [ReviewService],
    controllers: [ReviewController],
})
export class ReviewModule {}
