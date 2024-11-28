import { Injectable } from '@nestjs/common';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { Budget } from './entities/budget.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(Budget)
    private readonly budgetRepository: Repository<Budget>,
  ) {}

  async create(createBudgetDto: CreateBudgetDto) {
    const budget = await this.budgetRepository.create(createBudgetDto);
    return await this.budgetRepository.save(budget);
  }

  async findAll() {
    return await this.budgetRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} budget`;
  }

  update(id: number, updateBudgetDto: UpdateBudgetDto) {
    return `This action updates a #${id} budget`;
  }

  remove(id: number) {
    return `This action removes a #${id} budget`;
  }
}
