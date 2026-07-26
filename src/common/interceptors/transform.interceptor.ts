import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((res) => {
        // Extract custom message if set inside the service response
        const message = res?.message || 'Operation completed successfully';
        
        // Remove 'message' property from actual data payload if it exists
        let data = res;
        if (res && typeof res === 'object' && 'message' in res) {
          const { message: _, ...rest } = res;
          data = Object.keys(rest).length === 1 && 'data' in rest ? rest.data : rest;
        }

        return {
          success: true,
          statusCode,
          message,
          data: data !== undefined ? data : null,
        };
      }),
    );
  }
}