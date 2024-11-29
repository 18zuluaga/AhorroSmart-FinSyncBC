import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategorizedBudgetDto } from './dto/create-categorize-budget.dto';
import { UpdateCategorizeBudgetDto } from './dto/update-categorize-budget.dto';
import { UserService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { BudgetService } from 'src/budget/budget.service';
import { CategorizedBudget } from './entities/categorize-budget.entity';

@Injectable()
export class CategorizeBudgetService {
  constructor(
    @InjectRepository(CategorizedBudget)
    private readonly categorizedBudgetRepository: Repository<CategorizedBudget>,
    private readonly userService: UserService,
    private readonly budgetService: BudgetService,
  ) {}

  async create(
    createCategorizedBudgetDto: CreateCategorizedBudgetDto,
    user_id: number,
  ) {
    const user: User = await this.userService.findOne(user_id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const budget = await this.budgetService.createOrUpdate(
      {
        amount: createCategorizedBudgetDto.amount,
        date: createCategorizedBudgetDto.date,
      },
      user_id,
    );
    const categorizedBudget = this.categorizedBudgetRepository.create({
      ...createCategorizedBudgetDto,
      budget,
    });

    return await this.categorizedBudgetRepository.save(categorizedBudget);
  }

  async findAll(user_id: number) {
    const user: User = await this.userService.findOne(user_id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const categorizedBudgets = await this.categorizedBudgetRepository.find({
      where: { budget: { user: { id: user_id } } },
      relations: ['budget'],
    });

    if (!categorizedBudgets || categorizedBudgets.length === 0) {
      throw new NotFoundException('No categorized budgets found for this user');
    }

    return categorizedBudgets;
  }

  async findOne(id: number, user_id: number) {
    const user: User = await this.userService.findOne(user_id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const categorizedBudget = await this.categorizedBudgetRepository.findOne({
      where: { id, budget: { user: { id: user_id } } },
      relations: ['budget'],
    });

    if (!categorizedBudget) {
      throw new NotFoundException(
        `Categorized Budget #${id} not found for this user`,
      );
    }

    return categorizedBudget;
  }

  async update(
    id: number,
    updateCategorizeBudgetDto: UpdateCategorizeBudgetDto,
    user_id: number,
  ) {
    const user: User = await this.userService.findOne(user_id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const categorizedBudget = await this.categorizedBudgetRepository.findOne({
      where: { id, budget: { user: { id: user_id } } },
    });

    if (!categorizedBudget) {
      throw new NotFoundException(`Categorized Budget #${id} not found`);
    }

    const budget = await this.budgetService.findOne(
      categorizedBudget.budget.id,
      user_id,
    );

    if (!budget) {
      throw new NotFoundException(
        `Budget #${categorizedBudget.budget.id} not found`,
      );
    }

    if (
      updateCategorizeBudgetDto.newExpense ||
      updateCategorizeBudgetDto.newIncome
    ) {
      const budgetUpdate = await this.budgetService.update(
        categorizedBudget.budget.id,
        {
          totalExpenses:
            updateCategorizeBudgetDto.newExpense + budget.totalExpenses,
          totalIncomes:
            updateCategorizeBudgetDto.newIncome + budget.totalIncomes,
        },
        user_id,
      );
      if (!budgetUpdate.affected) {
        throw new Error('');
      }
    }

    categorizedBudget.totalExpenses =
      categorizedBudget.totalExpenses + updateCategorizeBudgetDto.newExpense;
    categorizedBudget.totalIncomes =
      updateCategorizeBudgetDto.newIncome + categorizedBudget.totalIncomes;

    return await this.categorizedBudgetRepository.update(
      id,
      updateCategorizeBudgetDto,
    );
  }

  async remove(id: number, user_id: number) {
    const user: User = await this.userService.findOne(user_id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const categorizedBudget = await this.categorizedBudgetRepository.findOne({
      where: { id, budget: { user: { id: user_id } } },
    });

    if (!categorizedBudget) {
      throw new NotFoundException(`Categorized Budget #${id} not found`);
    }

    await this.categorizedBudgetRepository.remove(categorizedBudget);
    return { message: `Categorized Budget #${id} has been removed` };
  }
}
