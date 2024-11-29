import { PartialType } from '@nestjs/swagger';
import { CreateBudgetDto } from './create-budget.dto';
import { IsNumber } from 'class-validator';

export class UpdateBudgetDto extends PartialType(CreateBudgetDto) {
  @IsNumber()
  totalExpenses?: number;

  @IsNumber()
  totalIncomes?: number;
}
