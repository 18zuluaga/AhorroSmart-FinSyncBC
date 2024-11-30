import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { UserService } from 'src/users/users.service';
import { CategorizeBudgetService } from 'src/categorize-budget/categorize-budget.service';
import { User } from 'src/users/entities/user.entity';
import { CategorizedBudget } from 'src/categorize-budget/entities/categorize-budget.entity';
import { UsersModule } from 'src/users/users.module';
import { CategorizeBudgetModule } from 'src/categorize-budget/categorize-budget.module';
import { BudgetModule } from 'src/budget/budget.module';
import { Budget } from 'src/budget/entities/budget.entity';
import { BudgetService } from 'src/budget/budget.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, User, CategorizedBudget, Budget]),
    UsersModule,
    CategorizeBudgetModule,
    BudgetModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService, UserService, CategorizeBudgetService, BudgetService],
})
export class TransactionModule {}
