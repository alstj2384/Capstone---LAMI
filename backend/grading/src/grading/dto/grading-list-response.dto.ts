import { ApiProperty } from '@nestjs/swagger';

class GradingListDTO {
    @ApiProperty({ type: [Number] })
    gradingList: number[];
}

export class GradingListResponseDTO {
    @ApiProperty({ example: 200 })
    code: number;

    @ApiProperty({ example: '채점 목록 조회 성공' })
    message: string;

    @ApiProperty({ type: GradingListDTO })
    data: GradingListDTO;
}
