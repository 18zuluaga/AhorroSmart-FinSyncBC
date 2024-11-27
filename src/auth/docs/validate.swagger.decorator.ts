import { Type, applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import {
  ApiBadRequest,
  ApiCreateResponses,
} from 'src/common/docs/swagger.decorators';

export function ApiDocValidateUser<T>(entity: Type<T>) {
  const description = 'You can use this endpoint to validate a user with a JWT';
  return applyDecorators(
    ApiOperation({
      summary: 'Validate User',
      description,
    }),
    ApiCreateResponses(entity),
    ApiBadRequest(),
    ApiBody({
      description: 'Entity and permissions required',
      schema: {
        type: 'object',
        properties: {
          entity: { type: 'string', example: 'users' },
          permissions: { type: 'string', example: 'can_update' },
        },
      },
    }),
  );
}
