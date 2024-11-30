import { Budget } from 'src/budget/entities/budget.entity';
import { ExpenseCategory } from 'src/common/enums/expense-category.enum';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity('categorized_budgets')
export class CategorizedBudget {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  category: ExpenseCategory;

  @Column()
  amount: number;

  @Column({ default: 0 })
  totalExpenses: number;

  @Column({ default: 0 })
  totalIncomes: number;

  @ManyToOne(() => Budget, (budget) => budget.categorizedBudgets, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'budget_id' })
  budget: Budget;

  @OneToMany(
    () => Transaction,
    (transaction) => transaction.categorizedBudget,
    { onDelete: 'CASCADE' },
  )
  transactions: Transaction;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
