import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;

        const message = this.getMessageForStatusCode(statusCode);

        return {
          statusCode,
          message,
          data,
        };
      }),
    );
  }

  private getMessageForStatusCode(statusCode: number): string {
    switch (statusCode) {
      case 200:
        return 'Request completed successfully';
      case 201:
        return 'Request completed successfully';
      case 400:
        return 'Request failed';
      case 401:
        return 'Unauthorized';
      case 403:
        return 'Forbidden';
      case 404:
        return 'Not found';
      case 500:
        return 'Internal server error';
      default:
        return 'Operation completed';
    }
  }
}
