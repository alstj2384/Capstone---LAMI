import { Controller, Post, Headers, Body, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ResponseService } from 'src/common/response/response.service';
import { ResponseCode } from '../common/enums/responseCode.enum';
import { GradingService } from './grading.service';
import { QuizSetDto } from './dto/quizSet.dto';
import { ApiBody, ApiHeader, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { GradingListResponseDTO } from './dto/grading-list-response.dto';

@Controller('api/grading')
export class GradingController {
    constructor(
        private readonly responseService: ResponseService,
        private readonly gradingService: GradingService,
    ) {}

    @Post()
    @ApiTags('Grading')
    @ApiOperation({ summary: '퀴즈 채점 및 저장' })
    @ApiHeader({ name: 'X-User-Id', required: true, description: '사용자 ID' })
    @ApiBody({
        description: '퀴즈 제출 예시',
        type: QuizSetDto,
        examples: {
            default: {
                summary: '기본 제출 예시',
                value: {
                    quizSetId: 1,
                    answers: [
                        { quizId: 1, quizType: 'MULTIPLE_CHOICE', answer: 1 },
                        { quizId: 2, quizType: 'MULTIPLE_CHOICE', answer: 2 },
                        { quizId: 3, quizType: 'MULTIPLE_CHOICE', answer: 3 },
                    ],
                },
            },
        },
    })
    async grading(@Headers('X-User-Id') userId: number, @Headers('Authorization') jwtToken: string, @Body() userSubmissions: QuizSetDto) {
        const gradingId = await this.gradingService.gradingAndSave(userId, userSubmissions.quizSetId, userSubmissions.answers, jwtToken);

        return this.responseService.response(ResponseCode.GRADING_200, {gradingId});
    }

    @Get()
    @ApiTags('Grading')
    @ApiOperation({ summary: '유저의 채점 ID 목록 조회' })
    @ApiHeader({
        name: 'X-User-Id',
        required: true,
        description: '유저의 고유 ID',
    })
    @ApiOkResponse({
        description: '채점 ID 배열 반환',
        type: GradingListResponseDTO,
    })
    async getGrading(@Headers('X-User-Id') userId: number) {
        const gradingList = await this.gradingService.getUserGradingIds(userId);
        return this.responseService.response(ResponseCode.GRADING_VIEW_ALL_200, { gradingList });
    }

    @Get(':gradingId')
    @ApiTags('Grading')
    @ApiOperation({ summary: '채점 결과 조회' })
    @ApiHeader({
        name: 'X-User-Id',
        required: true,
        description: '유저의 고유 ID',
    })
    @ApiParam({ name: 'gradingId', description: '채점 ID' })
    async submit(@Param('gradingId', ParseIntPipe) gradingId: number, @Headers('X-User-Id') userId: number) {

        const gradingResults = await this.gradingService.getGrading(gradingId, userId);

        return this.responseService.response(ResponseCode.GRADING_VIEW_200, { ...gradingResults });
    }

    @ApiTags('Grading Utils')
    @Get('/quizset/:gradingId')
    @ApiOperation({ summary: '채점ID로 문제집ID 조회' })
    @ApiParam({ name: 'gradingId', description: '채점 ID' })
    async getQuizSetId(@Param('gradingId', ParseIntPipe) gradingId: number) {
        const quizSetId = await this.gradingService.getQuizSetId(gradingId);

        return this.responseService.response(ResponseCode.GET_QUIZSETID_200, { quizSetId });
    }
}

