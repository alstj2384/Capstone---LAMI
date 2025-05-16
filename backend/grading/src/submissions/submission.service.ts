import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Submission } from './entities/submission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { gradeProblems } from 'src/common/utils/grading.util';
import { QuizDTO } from 'src/grading/dto/quiz.dto';
import { GradingResult } from 'src/common/interfaces/gradingResult.interface';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { extractAnswers } from 'src/common/utils/extractAnswers.util';
import { GradingService } from 'src/grading/grading.service';

@Injectable()
export class SubmissionService {
    constructor(
        @InjectRepository(Submission)
        private readonly submissionRepository: Repository<Submission>,
    ) {}

    async saveSubmission(submissions: Submission[]) {
        this.submissionRepository.save(submissions);
    }
}
