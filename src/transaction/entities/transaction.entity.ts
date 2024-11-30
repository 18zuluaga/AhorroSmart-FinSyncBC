import { CategorizedBudget } from 'src/categorize-budget/entities/categorize-budget.entity';
import { ExpenseCategory } from 'src/common/enums/expense-category.enum';
import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'enum', enum: ['Income', 'Expense'] })
  type: 'Income' | 'Expense';

  @Column()
  amount: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'text', nullable: true })
  note: string;

  @ManyToOne(() => User, (user) => user.transactions, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({name: 'user_id'})
  user: User;

  @ManyToOne(() => CategorizedBudget, (categorizedBudget) => categorizedBudget.transactions, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({name: 'categorized_budget_id'})
  categorizedBudget: CategorizedBudget;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
