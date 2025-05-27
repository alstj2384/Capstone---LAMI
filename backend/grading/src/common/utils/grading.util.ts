import { QuizDTO } from 'src/grading/dto/quiz.dto';
import { QuizType } from '../enums/QuizTypes.enum';
import { CorrectQuiz } from '../interfaces/correctQuiz.interface';
import { GradingResult } from '../interfaces/gradingResult.interface';
import { BadRequestException } from '@nestjs/common';

// 유형별 채점 방법
const gradingStrategies: Record<QuizType, (userAnswer: any, correctAnswer: any) => boolean> = {
    [QuizType.MULTIPLE_CHOICE]: (userAnswer, correctAnswer) => userAnswer === correctAnswer,
    [QuizType.TRUE_FALSE]: (userAnswer, correctAnswer) => userAnswer === correctAnswer,
    [QuizType.SHORT_ANSWER]: (userAnswer, correctAnswer) => userAnswer === correctAnswer,
};

// 단일 문제 채점
async function gradeSingleProblem(userSubmissions: QuizDTO, correctQuiz: CorrectQuiz): Promise<GradingResult> {
    const { quizId, quizType, answer } = userSubmissions;

    // 문제 유형 불일치 시 예외 발생
    if (quizType !== correctQuiz.QuizType) {
        throw new BadRequestException(`문제 유형 불일치: quizId ${quizId} - 제출된 유형 ${quizType}, 정답 유형 ${correctQuiz.QuizType}`);
    }

    const gradingFunction = gradingStrategies[quizType];

    if (!gradingFunction) {
        throw new BadRequestException(`지원하지 않는 문제 유형입니다: quizId ${quizId}, 유형 ${quizType}`);
    }

    const isCorrect = gradingFunction(answer, correctQuiz.correct);
    return { quizId, correct: isCorrect };
}

// 전체 문제 채점
export async function gradeProblems(userSubmissions: QuizDTO[], correctProblems: CorrectQuiz[]): Promise<GradingResult[]> {
    const gradingPromises = userSubmissions.map(async (userQuiz) => {
        const correctQuiz = correctProblems.find((q) => q.QuizId === userQuiz.quizId);

        if (!correctQuiz) {
            return { quizId: userQuiz.quizId, correct: false, reason: '문제를 찾을 수 없습니다.' };
        }

        return gradeSingleProblem(userQuiz, correctQuiz);
    });

    return Promise.all(gradingPromises);
}
