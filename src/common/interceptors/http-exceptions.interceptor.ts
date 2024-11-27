import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm'; // Para errores de base de datos

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Determinar el código de estado basado en la excepción
    const status = this.getStatusCode(exception);

    // Obtener detalles del error
    const errorDetails = this.getErrorDetails(exception);

    // Logging de la excepción para trazabilidad
    this.logger.error(
      `Error: ${errorDetails.message}, URL: ${request.url}, Method: ${request.method}, Status: ${status}`,
      exception instanceof Error ? exception.stack : '',
    );

    const errorResponse = {
      statusCode: status,
      message: errorDetails.message,
      error: errorDetails.error,
      details: errorDetails.details,
      path: request.url,
      timestamp: new Date().toISOString(),
    };
    response.status(status).json(errorResponse);
  }

  private getStatusCode(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    } else if (exception instanceof QueryFailedError) {
      return HttpStatus.BAD_REQUEST;
    } else if (exception instanceof TypeError) {
      return HttpStatus.UNPROCESSABLE_ENTITY;
    } else {
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  private getErrorDetails(exception: unknown): {
    error: string;
    message: string;
    details?: string;
  } {
    if (exception instanceof BadRequestException) {
      return {
        error:
          (exception.getResponse() as any)['message'] || 'Invalid input data',
        message: 'Bad Request',
      };
    } else if (exception instanceof NotFoundException) {
      return {
        error:
          (exception.getResponse() as any)['message'] || 'Resource not found',
        message: 'Not Found',
      };
    } else if (exception instanceof UnauthorizedException) {
      const response = exception.getResponse();
      const customMessage =
        typeof response === 'string'
          ? response
          : response['message'] ||
            'Authentication is required to access this resource';

      return {
        error: customMessage,
        message: 'Unauthorized',
      };
    } else if (exception instanceof ForbiddenException) {
      return {
        error:
          (exception.getResponse() as any)['message'] ||
          'You do not have permission to access this resource',
        message: 'Forbidden',
      };
    } else if (exception instanceof QueryFailedError) {
      return {
        error: (exception as QueryFailedError).message,
        message: 'Database Query Failed',
      };
    } else if (exception instanceof TypeError) {
      return {
        error: exception.message,
        message: 'Type Error',
        details: (exception as Error).stack,
      };
    } else if (exception instanceof HttpException) {
      return {
        error:
          (exception.getResponse() as any)['message'] || 'An error occurred',
        message: 'HTTP Error',
      };
    } else {
      return {
        error: 'An unexpected error occurred',
        message: 'Internal Server Error',
        details: (exception as Error).message || 'No additional details',
      };
    }
  }
}
