import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCategorizedBudgetDto } from './create-categorize-budget.dto';
import { IsDecimal, IsNumber, IsOptional } from 'class-validator';

export class UpdateCategorizeBudgetDto extends PartialType(
  CreateCategorizedBudgetDto,
) {
  @ApiProperty({ description: 'New income amount to update', example: 500.00, required: false })
  @IsOptional()
  @IsDecimal()
  newIncome?: number;

  @ApiProperty({ description: 'New expense amount to update', example: 200.00, required: false })
  @IsOptional()
  @IsDecimal()
  newExpense?: number;
}
