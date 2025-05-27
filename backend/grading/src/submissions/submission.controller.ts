import { Controller, Post } from '@nestjs/common';
import { ResponseService } from 'src/common/response/response.service';

@Controller('api/submission')
export class SubmissionController {
    constructor(private readonly responseService: ResponseService) {}
}
