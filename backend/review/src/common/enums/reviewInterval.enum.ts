export enum ReviewDifficulty {
    EASY = 'EASY',
    NORMAL = 'NORMAL',
    HARD = 'HARD',
}

export const ReviewIntervalHours: Record<ReviewDifficulty, number> = {
    [ReviewDifficulty.EASY]: 24, // 복습 주기 24시간
    [ReviewDifficulty.NORMAL]: 8, // 복습 주기 8시간
    [ReviewDifficulty.HARD]: 1, // 복습 주기 1시간
};
