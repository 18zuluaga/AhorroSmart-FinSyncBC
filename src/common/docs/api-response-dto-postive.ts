import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseSwagerDto<T> {
  @ApiProperty({ example: 200, description: 'The HTTP status code' })
  statusCode: number;

  @ApiProperty({ example: 'your request has been successfully completed' })
  message: string;

  @ApiProperty()
  data: T;
}
