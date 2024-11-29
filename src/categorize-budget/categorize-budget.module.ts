import { Module } from '@nestjs/common';
import { CategorizeBudgetService } from './categorize-budget.service';
import { CategorizeBudgetController } from './categorize-budget.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategorizedBudget } from './entities/categorize-budget.entity';
import { Budget } from 'src/budget/entities/budget.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { BudgetModule } from 'src/budget/budget.module';
import { UserService } from 'src/users/users.service';
import { BudgetService } from 'src/budget/budget.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategorizedBudget, Budget, User]),
    UsersModule,
    BudgetModule,
  ],
  controllers: [CategorizeBudgetController],
  providers: [CategorizeBudgetService, UserService, BudgetService],
})
export class CategorizeBudgetModule {}
