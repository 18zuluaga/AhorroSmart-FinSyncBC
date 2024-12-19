import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

    createCategorizedBudgetDto.date = new Date(createCategorizedBudgetDto.date);
    createCategorizedBudgetDto.date.setUTCDate(1);
    createCategorizedBudgetDto.date.setUTCHours(0, 0, 0, 0);

    console.log(createCategorizedBudgetDto.date);

    const bugetCategory = await this.categorizedBudgetRepository.findOne({
      where: {
        category: createCategorizedBudgetDto.category,
        budget: {
          user: { id: user_id },
          date: new Date(createCategorizedBudgetDto.date),
        },
      },
    });

    if (bugetCategory) {
      throw new ConflictException('Categorized budget already exists');
    }

    const budget = await this.budgetService.createOrUpdate(
      {
        amount: createCategorizedBudgetDto.amount,
        date: createCategorizedBudgetDto.date,
      },
      user_id,
    );

    console.log(budget);

    const categorizedBudget = this.categorizedBudgetRepository.create({
      ...createCategorizedBudgetDto,
      budget,
    });

    return await this.categorizedBudgetRepository.save(categorizedBudget);
  }

  async findByDate(date: string, user_id: number) {
    const dateParse = new Date(date);
    dateParse.setUTCDate(1);
    dateParse.setUTCHours(0, 0, 0, 0);
    const categorizedBudget = await this.categorizedBudgetRepository.find({
      where: { budget: { user: { id: user_id }, date: dateParse } },
    });

    if (!categorizedBudget) {
      throw new NotFoundException('Categorized budget not found');
    }

    return categorizedBudget;
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
    console.log(updateCategorizeBudgetDto);
  
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
  
    if (updateCategorizeBudgetDto.newExpense !== undefined) {
      const newTotalExpenses =
        updateCategorizeBudgetDto.newExpense + budget.totalExpenses;
      const budgetUpdate = await this.budgetService.update(
        categorizedBudget.budget.id,
        { totalExpenses: newTotalExpenses },
        user_id,
      );
      if (!budgetUpdate.affected) {
        throw new Error('Error updating total expenses');
      }
      categorizedBudget.totalExpenses += updateCategorizeBudgetDto.newExpense;
    }
  
    if (updateCategorizeBudgetDto.newIncome !== undefined) {
      const newTotalIncomes =
        updateCategorizeBudgetDto.newIncome + budget.totalIncomes;
      const budgetUpdate = await this.budgetService.update(
        categorizedBudget.budget.id,
        { totalIncomes: newTotalIncomes },
        user_id,
      );
      if (!budgetUpdate.affected) {
        throw new Error('Error updating total incomes');
      }
      categorizedBudget.totalIncomes += updateCategorizeBudgetDto.newIncome;
    }
  
    for (const [key, value] of Object.entries(updateCategorizeBudgetDto)) {
      if (value !== undefined && key !== 'newExpense' && key !== 'newIncome') {
        if (Object.prototype.hasOwnProperty.call(categorizedBudget, key)) {
          categorizedBudget[key] = value;
        } else {
          console.warn(`Property ${key} does not exist on categorizedBudget`);
        }
      }
    }
  
    console.log(categorizedBudget);
  
    await this.categorizedBudgetRepository.update(id, categorizedBudget);
  
    return await this.findOne(id, user_id);
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

    const budget = await this.budgetService.findOne(
      categorizedBudget.budget.id,
      user_id,
    );

    if (!budget) {
      throw new NotFoundException(`Budget #${categorizedBudget.budget.id} not found`);
    }

    const updatedBudget = await this.budgetService.update(
      categorizedBudget.budget.id,
      {
        amount: budget.amount - categorizedBudget.amount,
        totalExpenses: budget.totalExpenses - categorizedBudget.totalExpenses,
        totalIncomes: budget.totalIncomes - categorizedBudget.totalIncomes,
      },
      user_id,
    );

    if (!updatedBudget) {
      throw new NotFoundException(`error creating or updating budget`);
    }

    await this.categorizedBudgetRepository.remove(categorizedBudget);
    return { message: `Categorized Budget #${id} has been removed` };
  }
}
