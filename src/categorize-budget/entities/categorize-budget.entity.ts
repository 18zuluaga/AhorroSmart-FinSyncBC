import { Budget } from 'src/budget/entities/budget.entity';
import { ExpenseCategory } from 'src/common/enums/expense-category.enum';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('categorized_budgets')
export class CategorizedBudget {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar', length: 255 })
  category: ExpenseCategory;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalExpenses: number;

  @ManyToOne(() => Budget, (budget) => budget.categorizedBudgets, { onDelete: 'CASCADE', eager: true })
  budget: Budget;

  @OneToMany(() => Transaction, (transaction) => transaction.categorizedBudget, { onDelete: 'CASCADE' })
  transactions: Transaction;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
