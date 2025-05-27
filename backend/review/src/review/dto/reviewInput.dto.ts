import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReviewInputDTO {
    @ApiProperty({
        description: '채점 ID (gradingId)',
        example: 9,
    })
    @IsNotEmpty()
    @IsNumber()
    gradingId: number;

    @ApiProperty({
        description: '복습할 문제의 quizId',
        example: 1,
    })
    @IsNotEmpty()
    @IsNumber()
    quizId: number;
}
