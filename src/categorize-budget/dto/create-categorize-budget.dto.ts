import { IsDecimal, IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { ExpenseCategory } from 'src/common/enums/expense-category.enum';

export class CreateCategorizedBudgetDto {
  @IsEnum(ExpenseCategory)
  @IsNotEmpty()
  category: string;

  @IsDecimal()
  @IsNotEmpty()
  amount: number;

  @IsUUID()
  @IsNotEmpty()
  budgetId: string;
}
