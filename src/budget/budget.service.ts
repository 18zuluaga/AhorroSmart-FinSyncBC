import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { Budget } from './entities/budget.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/users/users.service';

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(Budget)
    private readonly budgetRepository: Repository<Budget>,
    private readonly userService: UserService,
  ) {}

  async create(createBudgetDto: CreateBudgetDto, user_id: number) {
    const today = new Date(new Date().setDate(1));
    createBudgetDto.date = new Date(new Date(createBudgetDto.date).setDate(1));
    if (createBudgetDto.date < today) {
      throw new ConflictException('Date should be in the future');
    }
    const user = await this.userService.findOne(user_id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const budget = await this.budgetRepository.create({
      ...createBudgetDto,
      user,
    });
    return await this.budgetRepository.save(budget);
  }

  async createOrUpdate(createBudgetDto: CreateBudgetDto, user_id: number) {
    const budget = await this.budgetRepository.findOne({
      where: { date: createBudgetDto.date, user: { id: user_id } },
    });
    if (budget) {
      createBudgetDto.amount = budget.amount + createBudgetDto.amount;
      await this.update(budget.id, createBudgetDto, user_id);
      return;
    } else {
      return await this.create(createBudgetDto, user_id);
    }
  }

  async findAll(id: number) {
    const budget = await this.budgetRepository.find({
      where: { user: { id } },
    });
    if (!Budget) {
      throw new NotFoundException('Budgets not found');
    }
    return budget;
  }

  async findOne(id: number, user_id: number) {
    const budget = await this.budgetRepository.findOne({
      where: { id, user: { id: user_id } },
    });
    if (!budget) {
      throw new NotFoundException('Budget not found');
    }
    return budget;
  }

  async findByDate(date: Date, user_id: number) {
    const budget = await this.budgetRepository.findOne({
      where: { date, user: { id: user_id } },
    });
    if (!budget) {
      throw new NotFoundException('Budget not found');
    }
    return budget;
  }

  async update(id: number, updateBudgetDto: UpdateBudgetDto, user_id: number) {
    const budget = await this.budgetRepository.findOne({
      where: { id, user: { id: user_id } },
    });
    if (!budget) {
      throw new NotFoundException('Budget not found');
    }
    if (updateBudgetDto.date) {
      const toDay = new Date(new Date().setDate(1));
      updateBudgetDto.date = new Date(new Date(updateBudgetDto.date));
      if (updateBudgetDto.date < toDay) {
        throw new ConflictException('Date should be in the future');
      }
    }
    return await this.budgetRepository.update(id, updateBudgetDto);
  }

  async remove(id: number, user_id: number) {
    const budget = await this.budgetRepository.findOne({
      where: { id, user: { id: user_id } },
    });
    if (!budget) {
      throw new NotFoundException('Budget not found');
    }
    return await this.budgetRepository.delete(id);
  }
}
