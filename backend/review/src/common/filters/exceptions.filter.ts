import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { BaseResponse } from '../response/base-response';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let statusCode: number;
        let message: string;

        if (exception instanceof HttpException) {
            statusCode = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            if (typeof exceptionResponse === 'string') {
                message = exceptionResponse;
            } else if (typeof exceptionResponse === 'object' && (exceptionResponse as any).message) {
                const extracted = (exceptionResponse as any).message;
                message = Array.isArray(extracted) ? extracted.join(', ') : extracted;
            } else {
                message = '알 수 없는 오류가 발생했습니다.';
            }
        } else {
            statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            message = '서버 내부 오류입니다.';
        }

        const baseResponse = new BaseResponse<null>(typeof message === 'string' ? message : '에러가 발생했습니다.', statusCode, null);

        response.status(statusCode).json(baseResponse);
    }
}
