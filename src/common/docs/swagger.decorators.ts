import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { ApiResponseSwagerDto } from './api-response-dto-postive';
import { ApiErrorResponseSwaggerDto } from './api-response-dto-errors';
import { ApiErrorResponseUnauthorizeSwaggerDto } from './api-response-dto-error-unauthorize';

export function ApiCreateResponses<T>(entity: Type<T>) {
  return applyDecorators(
    ApiExtraModels(ApiResponseSwagerDto),
    ApiOkResponse({
      description: `${entity.name} was created`,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseSwagerDto) },
          {
            properties: {
              data: { $ref: getSchemaPath(entity) },
            },
          },
        ],
      },
    }),
  );
}

export function ApiSuccessResponses<T>(entity: Type<T>) {
  return applyDecorators(
    ApiExtraModels(ApiResponseSwagerDto),
    ApiOkResponse({
      description: `Request Successful`,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseSwagerDto) },
          {
            properties: {
              data: { $ref: getSchemaPath(entity) },
            },
          },
        ],
      },
    }),
  );
}

export function ApiSuccessResponsesArray<T>(entity: Type<T>) {
  return applyDecorators(
    ApiExtraModels(ApiResponseSwagerDto),
    ApiOkResponse({
      description: `Request Successful`,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseSwagerDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(entity) },
              },
            },
          },
        ],
      },
    }),
  );
}

export function ApiBadRequest() {
  return applyDecorators(
    ApiExtraModels(ApiErrorResponseSwaggerDto),
    ApiResponse({
      description: 'Bad request',
      schema: { $ref: getSchemaPath(ApiErrorResponseSwaggerDto) },
    }),
  );
}

export function ApiUnauthorized() {
  return applyDecorators(
    ApiExtraModels(ApiErrorResponseUnauthorizeSwaggerDto),
    ApiResponse({
      description: 'Unauthorized',
      schema: { $ref: getSchemaPath(ApiErrorResponseUnauthorizeSwaggerDto) },
    }),
  );
}
