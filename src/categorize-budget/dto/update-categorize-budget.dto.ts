import { PartialType } from '@nestjs/swagger';
import { CreateCategorizedBudgetDto } from './create-categorize-budget.dto';

export class UpdateCategorizeBudgetDto extends PartialType(CreateCategorizedBudgetDto) {}
