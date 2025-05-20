export enum QuizType {
    MULTIPLE_CHOICE = 0,
    TRUE_FALSE = 1,
    SHORT_ANSWER = 2,
}

export const QuizTypeName = {
    [QuizType.MULTIPLE_CHOICE]: 'MULTIPLE_CHOICE',
    [QuizType.TRUE_FALSE]: 'TRUE_FALSE',
    [QuizType.SHORT_ANSWER]: 'SHORT_ANSWER',
};
