import { IsEnum, Validate, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { QuizType } from '../../common/enums/QuizTypes.enum';
import { MultipleChoiceAnswer } from '../../common/enums/choiceAnswer.enum';
import { OXAnswer } from '../../common/enums/oxAnswer.enum';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'AnswerMatchesType', async: false })
export class AnswerMatchesTypeConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        const object = args.object as any;

        if (value === undefined || value === null || value === '') {
            return true;
        }

        if (object.quizType === QuizType.MULTIPLE_CHOICE) {
            return Object.values(MultipleChoiceAnswer).includes(Number(value));
        } else if (object.quizType === QuizType.TRUE_FALSE) {
            return Object.values(OXAnswer).includes(value);
        } else if (object.quizType === QuizType.SHORT_ANSWER) {
            return typeof value === 'string' || typeof value === 'number';
        }

        return false;
    }

    defaultMessage(args: ValidationArguments) {
        return '문제유형에 따라 답은 단답형(문자/숫자), 4지선다(1~4) 또는 O,X여야 합니다.';
    }
}

export class QuizDTO {
    @ApiProperty({ description: '퀴즈 ID', example: 1 })
    @IsNumber()
    quizId: number;

    @ApiProperty({ enum: QuizType, description: '퀴즈 유형', example: 'MULTIPLE_CHOICE' })
    @IsEnum(QuizType)
    quizType: QuizType;

    @ApiPropertyOptional({
        description: '사용자 제출 답안: 문제 유형에 따라 다름',
        oneOf: [
            { type: 'number', example: 2, description: 'MULTIPLE_CHOICE: 1~4 중 하나' },
            { type: 'string', example: 'O', description: 'TRUE_FALSE: "O" or "X"' },
            { type: 'string', example: 'Cnidaria', description: 'SHORT_ANSWER: 단답형 텍스트' },
        ],
    })
    @Validate(AnswerMatchesTypeConstraint)
    @IsOptional()
    answer?: MultipleChoiceAnswer | OXAnswer | string | number;
}
