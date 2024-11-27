import { CategorizedBudget } from 'src/categorize-budget/entities/categorize-budget.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('budgets')
export class Budget {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalExpenses: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalIncomes: number;

  @ManyToOne(() => User, (user) => user.budgets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(
    () => CategorizedBudget,
    (categorizedBudget) => categorizedBudget.budget,
    { cascade: true },
  )
  categorizedBudgets: CategorizedBudget[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
