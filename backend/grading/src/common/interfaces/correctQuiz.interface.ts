import { QuizType } from '../enums/QuizTypes.enum';

export interface CorrectQuiz {
    QuizId: number;
    QuizType: QuizType;
    correct: number | 'O' | 'X';
}
