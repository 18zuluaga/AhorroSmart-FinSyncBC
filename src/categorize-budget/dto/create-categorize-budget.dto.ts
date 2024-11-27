import { IsDecimal, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateCategorizedBudgetDto {
  @IsString()
  @IsNotEmpty()
  category: string;

  @IsDecimal()
  @IsNotEmpty()
  amount: number;

  @IsUUID()
  @IsNotEmpty()
  budgetId: string;
}
