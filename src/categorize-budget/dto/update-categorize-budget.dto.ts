import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCategorizedBudgetDto } from './create-categorize-budget.dto';
import { IsDecimal, IsNumber, IsOptional } from 'class-validator';

export class UpdateCategorizeBudgetDto extends PartialType(
  CreateCategorizedBudgetDto,
) {
  @IsOptional()
  @IsDecimal()
  newIncome?: number;

  @IsOptional()
  @IsDecimal()
  newExpense?: number;
}
