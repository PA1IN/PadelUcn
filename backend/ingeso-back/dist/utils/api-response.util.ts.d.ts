import { HttpStatus } from '@nestjs/common';
import { ApiResponse } from '../interface/api-response';
export declare function CreateResponse<T>(message: string, data: T | null, statusCode: keyof typeof HttpStatus, error?: string, success?: boolean): ApiResponse<T>;
