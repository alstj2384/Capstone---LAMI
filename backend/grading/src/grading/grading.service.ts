import { Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import { QuizDTO } from './dto/quiz.dto';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Grading } from './entities/grading.entity';
import { gradeProblems } from 'src/common/utils/grading.util';
import { extractAnswers } from 'src/common/utils/extractAnswers.util';
import { SubmissionService } from 'src/submissions/submission.service';
import { Submission } from 'src/submissions/entities/submission.entity';
import { GradingResult } from 'src/common/interfaces/gradingResult.interface';
import { FormattedGradingResultDTO } from './dto/formatted-grading-result.dto';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { MemorizationMethod } from 'src/common/enums/memorizationMethod.enums';

@Injectable()
export class GradingService {
    constructor(
        @InjectRepository(Grading)
        private readonly gradingRepository: Repository<Grading>,
        private readonly submissionService: SubmissionService,
        private readonly httpService: HttpService,
    ) {}

    async createGrading(userId: number, quizSetId: number): Promise<Grading> {
        const grading = this.gradingRepository.create({
            userId,
            quizSetId,
            submissionDate: new Date(),
            score: 0, // 최초 생성 시 gradingId 반환 때문에 0 삽입 저장
        });

        return await this.gradingRepository.save(grading);
    }

    async updateScore(gradingId: number, score: number): Promise<void> {
        await this.gradingRepository.update(gradingId, { score });
    }

    async getProblems(quizSetId: number) {
        try {
            const response = await firstValueFrom(this.httpService.get(`${process.env.WORKBOOK_SERVER_URL}/problem/list/${quizSetId}`));

            if (!response.data?.data) {
                throw new BadRequestException('존재하지 않는 문제입니다.');
            }

            return response.data.data;
        } catch (error) {
            throw new InternalServerErrorException('문제 목록을 불러오는 중 오류가 발생했습니다.');
        }
    }

    async getMemorizationMethod(userId: number, jwtToken: string): Promise<string> {

    if (userId === undefined || userId === null || isNaN(userId)) {
        throw new BadRequestException('유효한 userId가 필요합니다.');
    }

    try {
        const response = await firstValueFrom(
            this.httpService.get(
                `${process.env.MEMBER_SERVER_URL}/members/memorization/${userId}`,
                {
                    headers: {
                        Authorization: jwtToken,
                        'X-User-Id': String(userId),
                    },
                }
            )
        );

        const memorizationMethod = response.data.data.memorizationMethod;

        if (!['AssociationMethod', 'StorytellingMethod', 'VocabConnectMethod'].includes(memorizationMethod)) {
            throw new BadRequestException('유효하지 않은 암기법입니다.');
        }

        return memorizationMethod;

    } catch (error) {
        throw new InternalServerErrorException('유저 암기법을 가져오는데 오류가 발생하였습니다.');
    }
}

    private getKoreanMemorizationMethod(method: string): string {
        const map: Record<string, string> = {
            AssociationMethod: MemorizationMethod.AssociationMethod,
            StorytellingMethod: MemorizationMethod.StorytellingMethod,
            VocabConnectMethod: MemorizationMethod.VocabConnectMethod,
        };

        if (!(method in map)) {
            throw new BadRequestException(`알 수 없는 암기법입니다. <${method}>`);
        }

        return map[method];
    }

    async getFeedback(question: string, choices: string, answer: string): Promise<string> {
        try {
            const response = await firstValueFrom(
                this.httpService.post(`${process.env.AI_SERVER_URL}/ai/feedback`, {
                    question,
                    choices,
                    answer,
                }),
            );

            if (!response.data?.data?.explain) {
                throw new BadRequestException('피드백이 존재하지 않습니다.');
            }

            console.log(response.data)

            return response.data.data.explain;
        } catch (error) {
            console.error('getFeedback error:', error?.message || error);
            throw new InternalServerErrorException('피드백을 생성하는 중 오류가 발생했습니다.');
        }
    }

    async getMemorization(question: string, choices: string, answer: string, method: string): Promise<string> {
        try {
            const response = await firstValueFrom(
                this.httpService.post(`${process.env.AI_SERVER_URL}/ai/memorization`, {
                    question,
                    choices,
                    answer,
                    method,
                }),
            );

            if (!response.data?.data?.memorize) {
                throw new BadRequestException('암기법이 존재하지 않습니다.');
            }
            console.log(response.data)

            return response.data.data.memorize;
        } catch (error) {
            console.error('getMemorization error:', error?.message || error);
            throw new InternalServerErrorException('암기법 생성 중 오류가 발생했습니다.');
        }
    }

    async grading(quizSetId: number, userSubmissions: QuizDTO[]): Promise<GradingResult[]> {
        // API 이용해서 문제집(문제포함) 가져오기
        const problems = await this.getProblems(quizSetId);

        // 가져온 문제집에서 문제 정보 중 문제ID, 문제타입, 정답 추출해서 적절한 형태로 만들기 (Util)
        const problemAnswers = await extractAnswers(problems);

        // 문제 채점해서 결과 추출하기
        const gradingResults = await gradeProblems(userSubmissions, problemAnswers);

        // 유저 문제 각각에 대한 제출과 정답 피드백 저장
        return gradingResults;
    }

    private async createGradingEntity(userId: number, quizSetId: number): Promise<Grading> {
        const existing = await this.gradingRepository.findOne({
            where: { userId, quizSetId },
        });

        // if (existing) {
        //     throw new BadRequestException('이미 해당 문제집에 대한 채점 기록이 존재합니다.');
        // }

        return await this.createGrading(userId, quizSetId);
    }

    private async createSubmissionsFromResults(
        grading: Grading,
        gradingResults: GradingResult[],
        userSubmissions: QuizDTO[],
        problemMap: Map<number, any>,
        jwtToken: string
    ): Promise<Submission[]> {
        let method: string = '스토리텔링';
        try {
            const methodEnum = await this.getMemorizationMethod(grading.userId, jwtToken);
            method = this.getKoreanMemorizationMethod(methodEnum);
        } catch (e) {
            console.warn(`유저 암기법 조회에 실패하였습니다. <${e.message}>`);
        }

        return await Promise.all(
            gradingResults.map(async (result, idx) => {
                const submission = new Submission();
                const userQuiz = userSubmissions[idx];
                const problem = problemMap.get(userQuiz.quizId);

                if (!problem) {
                    throw new BadRequestException(`quizId ${userQuiz.quizId}에 해당하는 문제가 존재하지 않습니다.`);
                }

                submission.quizId = userQuiz.quizId;
                submission.submittedAnswer = userQuiz.answer?.toString() ?? '';
                submission.isCorrect = result.correct;
                submission.grading = grading;

                if (!result.correct) {
                    const question = problem.question;
                    const choices = problem.choices ?? '';
                    const answer = submission.submittedAnswer;

                    try {
                        const [feedback, memorization] = await Promise.all([
                            this.getFeedback(question, choices, answer),
                            this.getMemorization(question, choices, answer, method),
                        ]);
                        submission.feedback = typeof feedback === 'string' ? feedback : '';
                        submission.memorization = typeof memorization === 'string' ? memorization : '';
                    } catch (e) {
                        console.warn(`피드백 / 암기법 요청 실패: ${e.message}`);
                    }
                }

                return submission;
            }),
        );
    }

    private async persistSubmissionsAndScore(grading: Grading, submissions: Submission[], gradingResults: GradingResult[]) {
        const gradingRef = { id: grading.id } as Grading;

        for (const s of submissions) {
            s.grading = gradingRef;
        }

        await this.submissionService.insertSubmissions(submissions);

        const correctCount = gradingResults.filter((r) => r.correct).length;
        await this.updateScore(grading.id, correctCount);
    }

    async saveData(gradingResults: GradingResult[], userSubmissions: QuizDTO[], userId: number, quizSetId: number, jwtToken: string): Promise<number> {
        const grading = await this.createGradingEntity(userId, quizSetId);

        const problems = await this.getProblems(quizSetId);
        const problemMap = new Map<number, any>(problems.map((p) => [p.problemId, p]));

        if (gradingResults.length !== userSubmissions.length) {
            throw new BadRequestException('제출 수와 채점 결과 수가 일치하지 않습니다.');
        }

        const submissions = await this.createSubmissionsFromResults(grading, gradingResults, userSubmissions, problemMap, jwtToken);

        await this.persistSubmissionsAndScore(grading, submissions, gradingResults);

        return grading.id;
    }

    async gradingAndSave(userId: number, quizSetId: number, userSubmissions: QuizDTO[], jwtToken: string): Promise<number> {

        const gradingResults = await this.grading(quizSetId, userSubmissions);

        const gradingId = await this.saveData(gradingResults, userSubmissions, userId, quizSetId, jwtToken);

        return gradingId;
    }

    async getUserGradingIds(userId: number): Promise<number[]> {

        if (!userId && userId !== 0) {
            throw new BadRequestException('유효하지 않은 UserID 입니다.');
        }

        const gradings = await this.gradingRepository.find({
            where: { userId },
            select: ['id'],
            order: { submissionDate: 'DESC' },
        });

        if (gradings.length === 0) {
            throw new BadRequestException(`해당 유저의 채점 기록이 존재하지 않습니다.`);
        }

        return gradings.map((g) => g.id);
    }

    async getGrading(gradingId: number, userId: number): Promise<FormattedGradingResultDTO> {

        const grading = await this.gradingRepository.findOne({
            where: { id: gradingId, userId },
            relations: ['submissions'],
        });

        if (!grading) {
            throw new BadRequestException(`존재하지 않는 채점입니다.`);
        }

        const problems = await this.getProblems(grading.quizSetId);
        const problemMap = new Map<number, any>(problems.map((p) => [p.problemId, p]));

        const formattedProblems = grading.submissions.map((sub) => {
            const problem = problemMap.get(sub.quizId);

            return {
                quizId: sub.quizId,
                answer: problem?.answer ?? '',
                submittedAnswer: sub.submittedAnswer,
                isCorrect: sub.isCorrect,
                memorization: sub.memorization ?? '',
                feedback: sub.feedback ?? '',
            };
        });

        const correctCount = formattedProblems.filter((p) => p.isCorrect).length;
        const totalCount = formattedProblems.length;

        const response: FormattedGradingResultDTO = {
            quizSetId: grading.quizSetId,
            gradingId: grading.id,
            totalCount,
            correctCount,
            incorrectCount: totalCount - correctCount,
            submissionDate: this.formatDate(grading.submissionDate),
            submissions: formattedProblems,
        };

        return response;
    }

    private formatDate(date: Date): string {
        if (!(date instanceof Date) || isNaN(date.getTime())) {
            throw new InternalServerErrorException('날짜 변환 중 오류가 발생했습니다.');
        }
        return date.toISOString().split('T')[0].replace(/-/g, '.');
    }

    async getQuizSetId(gradingId: number): Promise<number> {
        const grading = await this.gradingRepository.findOne({
            where: {
                id: gradingId,
            },
        });

        if (!grading) {
            throw new BadRequestException('존재 하지 않는 채점 기록입니다.');
        }
        return grading.quizSetId;
    }
}
