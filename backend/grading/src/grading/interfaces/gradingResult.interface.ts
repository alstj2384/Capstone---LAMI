export interface FormattedGradingResult {
    id: number;
    quizSetId: number;
    totalCount: number;
    correctCount: number;
    incorrectCount: number;
    submissionDate: string;
    problems: FormattedProblem[];
}

export interface FormattedProblem {
    quizId: number;
    answer: string;
    submittedAnswer: string;
    correct: boolean;
    feedback: string;
    memorization: string;
}
