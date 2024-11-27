import { PartialType } from '@nestjs/swagger';
import { CreateCategorizeBudgetDto } from './create-categorize-budget.dto';

export class UpdateCategorizeBudgetDto extends PartialType(CreateCategorizeBudgetDto) {}
