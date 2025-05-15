import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ReviewDifficulty } from 'src/common/enums/reviewInterval.enum';

export class UpdateReviewIntervalDTO {
    @ApiProperty({
        enum: ReviewDifficulty,
        description: `복습 난이도를 선택합니다.\n
        - HARD: 1시간 후 복습
        - NORMAL: 8시간 후 복습
        - EASY: 24시간 후 복습`,
        example: ReviewDifficulty.NORMAL,
    })
    @IsEnum(ReviewDifficulty)
    difficulty: ReviewDifficulty;
}
