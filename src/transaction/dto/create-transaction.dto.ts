import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({ description: 'Nombre de la transacción', example: 'Pago de alquiler' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Tipo de transacción (Income o Expense)', example: 'Income', enum: ['Income', 'Expense'] })
  @IsEnum(['Income', 'Expense'])
  type: 'Income' | 'Expense';

  @ApiProperty({ description: 'Monto de la transacción', example: 1000.50 })
  @IsNumber()
  amount: number;

  @ApiPropertyOptional({ description: 'Nota adicional de la transacción', example: 'Pago adelantado de servicios' })
  @IsOptional()
  @IsString()
  note?: string;
}
