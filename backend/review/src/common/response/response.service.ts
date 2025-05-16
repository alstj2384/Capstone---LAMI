// src/common/services/response.service.ts

import { Injectable } from '@nestjs/common';
import { ResponseCode, ResponseMessage } from '../enums/responseCode.enum';
import { BaseResponse } from './base-response';

@Injectable()
export class ResponseService {
    async response<T>(code: ResponseCode, data: T): Promise<BaseResponse<T>> {
        const { message, statusCode } = ResponseMessage[code];
        return new BaseResponse<T>(message, statusCode, data);
    }

    // async fail<T>(code: ResponseCode, data: T | null = null): Promise<BaseResponse<T>> {
    //     const { message, statusCode } = ResponseMessage[code];
    //     return new BaseResponse<T>(message, statusCode, data);
    // }
}
