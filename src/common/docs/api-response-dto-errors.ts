import { ApiProperty } from '@nestjs/swagger';

export class ApiErrorResponseSwaggerDto {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: 'error description ' })
  message: string;

  @ApiProperty({ example: 'Bad Request' })
  error: string;
}
