import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Submission } from './entities/submission.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SubmissionService {
    constructor(
        @InjectRepository(Submission)
        private readonly submissionRepository: Repository<Submission>,
    ) {}

    async saveSubmission(submissions: Submission[]) {
        await this.submissionRepository.save(submissions);
    }

    async insertSubmissions(submissions: Submission[]) {
        return this.submissionRepository.insert(submissions);
    }

    getRepository(): Repository<Submission> {
        return this.submissionRepository;
    }
}
