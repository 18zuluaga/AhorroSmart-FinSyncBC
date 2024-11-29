import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ExpenseCategory } from 'src/common/enums/expense-category.enum';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(['Income', 'Expense'])
  type: 'Income' | 'Expense';

  @IsNumber()
  amount: number;

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsOptional()
  @IsString()
  note?: string;
}
