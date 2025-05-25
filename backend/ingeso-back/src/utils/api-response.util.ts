import { HttpStatus } from '@nestjs/common';
import { ApiResponse } from '../interface/Apiresponce';
import { Logger } from '@nestjs/common';
const logger = new Logger('ApiResponseUtil');
logger.log('Módulo de respuesta API iniciado');
export function CreateResponse<T>(
  message: string,
  data: T | null,
  statusCode: keyof typeof HttpStatus,
  error?: string,
  success: boolean = true, 
): ApiResponse<T> {
  return {
    statusCode: HttpStatus[statusCode], 
    message,
    data,
    success, 
    ...(error && { error }),
    
  };
}