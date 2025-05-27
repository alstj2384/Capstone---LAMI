export class BaseResponse<T> {
    // success: boolean;
    message: string;
    statusCode: number;
    data: T | null;

    constructor(message: string, statusCode: number, data: T | null = null) {
        // this.success = statusCode >= 200 && statusCode < 300;
        this.message = message;
        this.statusCode = statusCode;
        this.data = data;
    }
}
