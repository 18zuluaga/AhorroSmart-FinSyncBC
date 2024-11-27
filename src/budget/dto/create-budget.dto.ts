import { IsInt, IsNotEmpty, IsNumber, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCategorizedBudgetDto } from 'src/categorize-budget/dto/create-categorize-budget.dto';

export class CreateBudgetDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsInt()
  @IsNotEmpty()
  month: number;

  @IsInt()
  @IsNotEmpty()
  year: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCategorizedBudgetDto)
  categorizedBudgets: CreateCategorizedBudgetDto[];
}
