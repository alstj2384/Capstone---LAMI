import { Module } from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { SubmissionController } from './submission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Submission } from './entities/submission.entity';
import { ResponseModule } from 'src/common/response/response.module';

@Module({
    imports: [TypeOrmModule.forFeature([Submission]), ResponseModule],
    providers: [SubmissionService],
    controllers: [SubmissionController],
    exports: [SubmissionService],
})
export class SubmissionModule {}
