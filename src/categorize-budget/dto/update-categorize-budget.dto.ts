import { PartialType } from '@nestjs/swagger';
import { CreateCategorizedBudgetDto } from './create-categorize-budget.dto';
import { IsNumber } from 'class-validator';

export class UpdateCategorizeBudgetDto extends PartialType(
  CreateCategorizedBudgetDto,
) {
  @IsNumber()
  newIncome?: number;

  @IsNumber()
  newExpense?: number;
}
