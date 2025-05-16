import { QuizType } from '../enums/QuizTypes.enum';
import { CorrectQuiz } from '../interfaces/correctQuiz.interface';

export function extractAnswers(quizs: any[]): CorrectQuiz[] {
    return quizs.map((quiz) => {
        const rawType = quiz.quiz_type || quiz.questionType;
        const quizType = rawType as QuizType;

        if (!Object.values(QuizType).includes(quizType)) {
            throw new Error(`알 수 없는 문제 형식입니다: ${rawType}`);
        }

        const quizId = quiz.id || quiz.problemId;

        return {
            QuizId: quizId,
            QuizType: quizType,
            correct: typeof quiz.answer === 'string' && !isNaN(Number(quiz.answer)) ? Number(quiz.answer) : quiz.answer,
        };
    });
}
