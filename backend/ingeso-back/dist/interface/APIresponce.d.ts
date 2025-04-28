export interface ApiResponse<T> {
    statusCode: number;
    message: string;
    data: T | null;
    error?: string;
    success: boolean;
}
