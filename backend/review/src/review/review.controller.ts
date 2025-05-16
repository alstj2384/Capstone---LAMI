import { Body, Controller, Get, Post, Headers, Delete, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader, ApiParam, ApiBody } from '@nestjs/swagger';
import { ReviewService } from './review.service';
import { ResponseService } from 'src/common/response/response.service';
import { ResponseCode } from 'src/common/enums/responseCode.enum';
import { ReviewInputDTO } from './dto/reviewInput.dto';
import { ReviewInputQueryDTO } from './dto/reviewInputQuery.dto';
import { UpdateReviewIntervalDTO } from './dto/reviewUpdate.dto';

@ApiTags('Review')
@Controller('/api/review')
export class ReviewController {
    constructor(
        private readonly reviewService: ReviewService,
        private readonly responseService: ResponseService,
    ) {}

    @Post()
    @ApiOperation({ summary: '복습 생성' })
    @ApiHeader({ name: 'X-User-Id', required: true, description: '사용자 ID' })
    @ApiBody({ type: ReviewInputDTO })
    async makeReview(@Headers('X-User-Id') userId: number, @Body() reviewInput: ReviewInputDTO) {
        await this.reviewService.createReview(+userId, reviewInput);
        return this.responseService.response(ResponseCode.REVIEW_200, {});
    }

    @Get()
    @ApiOperation({ summary: '복습 가능한 문제 조회' })
    @ApiHeader({ name: 'X-User-Id', required: true, description: '사용자 ID' })
    async getReviews(@Headers('X-User-Id') userId: number) {
        const results = await this.reviewService.getReview(+userId);
        return this.responseService.response(ResponseCode.REVIEW_VIEW_200, { results });
    }

    @Delete(':reviewId')
    @ApiOperation({ summary: '복습 삭제' })
    @ApiHeader({ name: 'X-User-Id', required: true, description: '사용자 ID' })
    @ApiParam({ name: 'reviewId', description: '삭제할 복습 ID' })
    async deleteReview(@Headers('X-User-Id') userId: number, @Param('reviewId', ParseIntPipe) reviewId: number) {
        await this.reviewService.deleteReview(+userId, reviewId);
        return this.responseService.response(ResponseCode.REVIEW_DEL_SUCCESS_204, {});
    }

    @Patch(':reviewId')
    @ApiOperation({ summary: '복습 주기 갱신 (난이도 기반)' })
    @ApiHeader({ name: 'X-User-Id', required: true, description: '사용자 ID' })
    @ApiParam({ name: 'reviewId', description: '업데이트할 복습 ID' })
    @ApiBody({
        description: '난이도에 따라 복습 시간이 정해집니다.\nHARD: 1시간, NORMAL: 8시간, EASY: 24시간',
        schema: {
            example: {
                difficulty: 'NORMAL', // 8시간 후 복습 예정
            },
        },
    })
    async updateReviewSchedule(
        @Headers('X-User-Id') userId: number,
        @Param('reviewId', ParseIntPipe) reviewId: number,
        @Body() intervalInput: UpdateReviewIntervalDTO,
    ) {
        await this.reviewService.updateReviewTime(+userId, reviewId, intervalInput.difficulty);
        return this.responseService.response(ResponseCode.REVIEW_INTERVAL_200, {});
    }
}
