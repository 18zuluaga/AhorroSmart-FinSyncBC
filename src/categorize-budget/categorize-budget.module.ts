import { Module } from '@nestjs/common';
import { CategorizeBudgetService } from './categorize-budget.service';
import { CategorizeBudgetController } from './categorize-budget.controller';

@Module({
  controllers: [CategorizeBudgetController],
  providers: [CategorizeBudgetService],
})
export class CategorizeBudgetModule {}
