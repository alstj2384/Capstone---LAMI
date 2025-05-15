// src/common/response/response-code.enum.ts

export enum ResponseCode {
    AUTH_200 = 'AUTH_200',
    AUTH_401 = 'AUTH_401',
    AUTH_403 = 'AUTH_403',
    REVIEW_200 = 'REVIEW_200',
    REVIEW_VIEW_200 = 'REVIEW_VIEW_200',
    REVIEW_DEL_SUCCESS_204 = 'REVIEW_DEL_SUCCESS_204',
    REVIEW_INTERVAL_200 = 'REVIEW_INTERVAL_200',
    COMMON_400 = 'COMMON_400',
    SERVER_500 = 'SERVER_500',
}

export const ResponseMessage: Record<ResponseCode, { message: string; statusCode: number }> = {
    [ResponseCode.AUTH_200]: { message: 'JWT_TOKEN 검증에 성공하였습니다', statusCode: 200 },
    [ResponseCode.AUTH_401]: { message: 'JWT_TOKEN이 유효하지 않습니다', statusCode: 401 },
    [ResponseCode.AUTH_403]: { message: 'JWT_TOKEN 접근이 거부되었습니다', statusCode: 403 },
    [ResponseCode.REVIEW_200]: { message: '복습 담기에 성공하였습니다.', statusCode: 200 },
    [ResponseCode.REVIEW_VIEW_200]: { message: '복습목록 조회에 성공하였습니다.', statusCode: 200 },
    [ResponseCode.REVIEW_DEL_SUCCESS_204]: { message: '복습 삭제에 성공하였습니다.', statusCode: 204 },
    [ResponseCode.REVIEW_INTERVAL_200]: { message: '복습 주기 설정에 성공하였습니다.', statusCode: 204 },
    [ResponseCode.COMMON_400]: { message: '요청이 잘못되었습니다.', statusCode: 400 },
    [ResponseCode.SERVER_500]: { message: '서버 내부 오류입니다.', statusCode: 500 },
};
