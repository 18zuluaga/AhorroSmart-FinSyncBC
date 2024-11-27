import { Budget } from 'src/budget/entities/budget.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('categorized_budgets')
export class CategorizedBudget {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar', length: 255 })
  category: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalExpenses: number;

  @ManyToOne(() => Budget, (budget) => budget.categorizedBudgets, { onDelete: 'CASCADE' })
  budget: Budget;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
