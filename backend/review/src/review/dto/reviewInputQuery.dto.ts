import { IsNumber, IsOptional } from 'class-validator';

export class ReviewInputQueryDTO {
    @IsNumber()
    userId: number;

    @IsOptional()
    @IsNumber()
    quizSetId: number;

    @IsOptional()
    @IsNumber()
    quizId?: number;
}
