import { IsDate, IsDecimal, IsEnum, IsNotEmpty } from 'class-validator';
import { ExpenseCategory } from 'src/common/enums/expense-category.enum';

export class CreateCategorizedBudgetDto {
  @IsEnum(ExpenseCategory)
  @IsNotEmpty()
  category: ExpenseCategory;

  @IsDecimal()
  @IsNotEmpty()
  amount: number;

  @IsDate()
  @IsNotEmpty()
  date: Date;
}
