import { FormattedProblemDTO } from './formatted-problem.dto';

export class FormattedGradingResultDTO {
    quizSetId: number;

    gradingId: number;

    totalCount: number;

    correctCount: number;

    incorrectCount: number;

    submissionDate: string;

    submissions: FormattedProblemDTO[];
}
