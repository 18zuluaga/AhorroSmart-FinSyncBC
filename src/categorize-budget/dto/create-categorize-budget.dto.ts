import { IsDateString, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { ExpenseCategory } from 'src/common/enums/expense-category.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategorizedBudgetDto {
  @ApiProperty({ description: 'Category of the budget', enum: ExpenseCategory })
  @IsEnum(ExpenseCategory)
  @IsNotEmpty()
  category: ExpenseCategory;

  @ApiProperty({ description: 'Amount allocated for the category', example: 1000.00 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ description: 'Date of the budget allocation', example: '2023-12-31' })
  @IsDateString()
  @IsNotEmpty()
  date: Date;
}
