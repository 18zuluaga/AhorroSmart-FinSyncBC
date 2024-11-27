import { ApiProperty } from '@nestjs/swagger';

export class ApiErrorResponseUnauthorizeSwaggerDto {
  @ApiProperty({ example: 401, description: 'The HTTP status code' })
  statusCode: number;

  @ApiProperty({ example: 'Entity duplicated', description: 'Invalid token' })
  message: string;

  @ApiProperty({ example: 'Unauthorized', description: 'Unauthorized' })
  error: string;
}
