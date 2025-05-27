import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested, IsNumber } from 'class-validator';
import { QuizDTO } from './quiz.dto';

export class QuizSetDto {
    @ApiProperty({ description: '문제집 ID' })
    @IsNumber()
    quizSetId: number;

    @ApiProperty({ type: [QuizDTO], description: '사용자 제출 답안 리스트' })
    @ValidateNested({ each: true })
    @Type(() => QuizDTO)
    answers: QuizDTO[];
}
