import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { LessThanOrEqual, Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ReviewResultDTO } from './dto/reviewResult.dto';
import { plainToInstance } from 'class-transformer';
import { ReviewDifficulty } from 'src/common/enums/reviewInterval.enum';
import { ReviewInputDTO } from './dto/reviewInput.dto';

@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(Review)
        private readonly reviewRepository: Repository<Review>,
        private readonly httpService: HttpService,
    ) {}

    async getQuizSetId(gradingId: number) {
        try {
            const res = await firstValueFrom(this.httpService.get(`${process.env.GRADING_SERVER_URL}/grading/quizset/${gradingId}`));
            return res.data.data.quizSetId;
        } catch (err) {
            throw new NotFoundException('채점 정보를 불러올 수 없습니다.');
        }
    }

    async getProblems(quizSetId: number) {
        try {
            const response = await firstValueFrom(this.httpService.get(`${process.env.WORKBOOK_SERVER_URL}/problem/list/${quizSetId}`));
            return response.data.data;
        } catch (err) {
            throw new NotFoundException('문제 정보를 불러올 수 없습니다.');
        }
    }

    async createReview(userId: number, reviewInput: ReviewInputDTO): Promise<void> {
        const toReview = new Date();

        const quizSetId = await this.getQuizSetId(reviewInput.gradingId);

        // 중복 체크
        const existing = await this.reviewRepository.findOne({
            where: {
                userId: userId,
                gradingId: reviewInput.gradingId,
                quizId: reviewInput.quizId,
            },
        });

        if (existing) {
            throw new BadRequestException('이미 존재하는 복습입니다.');
        }

        const review = this.reviewRepository.create({
            userId: userId,
            toReview: toReview,
            gradingId: reviewInput.gradingId,
            quizId: reviewInput.quizId,
            quizSetId: quizSetId,
        });

        await this.reviewRepository.save(review);
    }

    async getReview(userId: number): Promise<ReviewResultDTO[]> {
        const now = new Date();

        const reviews = await this.reviewRepository.find({
            where: {
                userId,
                toReview: LessThanOrEqual(now),
            },
        });

        if (reviews.length === 0) {
            throw new NotFoundException('복습할 문제가 존재하지 않습니다.');
        }

        const result: ReviewResultDTO[] = [];

        const quizSetCache = new Map<number, any>();

        for (const review of reviews) {
            let problems = quizSetCache.get(review.quizSetId);
            if (!problems) {
                problems = await this.getProblems(review.quizSetId);
                quizSetCache.set(review.quizSetId, problems);
            }

            const matchedProblem = problems.find((p) => p.problemId === review.quizId);

            if (matchedProblem) {
                const dto = plainToInstance(ReviewResultDTO, {
                    reviewId: review.id,
                    quizSetId: review.quizSetId,
                    quizId: review.quizId,
                    quizContent: matchedProblem.question,
                    answer: matchedProblem.answer,
                    choices: matchedProblem.choices,
                });

                result.push(dto);
            }
        }

        return result;
    }

    async deleteReview(userId: number, reviewId: number): Promise<void> {
        const review = await this.reviewRepository.findOne({
            where: { id: reviewId, userId: userId },
        });

        if (!review) {
            throw new NotFoundException(`해당 리뷰를 찾을 수 없습니다.`);
        }

        await this.reviewRepository.remove(review);
    }

    async updateReviewTime(userId: number, reviewId: number, difficulty: ReviewDifficulty) {
        const review = await this.reviewRepository.findOne({ where: { id: reviewId, userId } });
        if (!review) throw new NotFoundException('리뷰를 찾을 수 없습니다.');

        const delayMap = {
            HARD: 1,
            NORMAL: 8,
            EASY: 24,
        };

        const now = new Date();
        const toReview = new Date(now.getTime() + delayMap[difficulty] * 60 * 60 * 1000);
        review.toReview = toReview;

        await this.reviewRepository.save(review);
    }
}
