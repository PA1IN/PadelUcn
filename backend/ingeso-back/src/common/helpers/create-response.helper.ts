export interface ApiResponse<T = any> {
  statusCode: number;
  message: string;
  data: T;
  success: boolean;
}

export function CreateResponse<T = any>(
  message: string,
  data: T,
  status: 'SUCCESS' | 'CREATED' | 'ERROR' = 'SUCCESS'
): ApiResponse<T> {
  const statusCode = status === 'CREATED' ? 201 : status === 'ERROR' ? 400 : 200;
  
  return {
    statusCode,
    message,
    data,
    success: status !== 'ERROR'
  };
}