export function CustomResponse(
  message: string,
  data: any,
  statusCode: string,
  error?: string,
  success?: boolean
) {
  return {
    statusCode: statusCode === 'OK' || statusCode === 'SUCCESS' || statusCode === 'CREATED' ? 200 : 400,
    message,
    data,
    success: success !== undefined ? success : (statusCode === 'OK' || statusCode === 'SUCCESS' || statusCode === 'CREATED'),
    ...(error && { error })
  };
}