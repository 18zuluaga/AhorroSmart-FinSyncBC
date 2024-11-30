import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { User } from 'src/users/entities/user.entity';
import { CategorizeBudgetService } from 'src/categorize-budget/categorize-budget.service';
import { UserService } from 'src/users/users.service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly categorizeBudgetService: CategorizeBudgetService,
    private readonly userService: UserService,
  ) {}

  async create(createTransactionDto: CreateTransactionDto, user: User) {

    const findUser: User = await this.userService.findOne(user.id);
    if (!findUser) {
      throw new NotFoundException('User not found');
    }

    const transaction = this.transactionRepository.create({
      ...createTransactionDto,
      user,
      date: new Date(),
    });

    const wasUpdated = await this.categorizeBudgetService.update(
      createTransactionDto.categorizedBudgetId,
      createTransactionDto.type === 'Income'
        ? { newIncome: createTransactionDto.amount }
        : { newExpense: createTransactionDto.amount },
      user.id,
    );

    if (!wasUpdated) {
      throw new UnauthorizedException('You are not authorized to update this budget');
    }

    const categorizedBudget = await this.categorizeBudgetService.findOne(
      createTransactionDto.categorizedBudgetId,
      user.id,
    );

    if (!categorizedBudget) {
      throw new NotFoundException(
        `Categorized Budget #${createTransactionDto.categorizedBudgetId} not found`,
      );
    }

    transaction.categorizedBudget = categorizedBudget;

    return await this.transactionRepository.save(transaction);
  }

  async findAll(user: User) {
    return await this.transactionRepository.find({
      where: { user: { id: user.id } },
    });
  }

  async findOne(id: number, user: User) {
    const transaction = await this.transactionRepository.findOne({
      where: { id, user: { id: user.id } },
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found.`);
    }

    return transaction;
  }

  async update(
    id: number,
    updateDto: Partial<CreateTransactionDto>,
    user: User,
  ) {
    const transaction = await this.findOne(id, user);
  
    const originalAmount = transaction.amount;
    const originalType = transaction.type;
    const newAmount = updateDto.amount ?? originalAmount;
    const newType = updateDto.type ?? originalType;
  
    let amountDifference: number;
  
    if (originalType === newType) {
      amountDifference = newAmount - originalAmount;
    } else {
      amountDifference = newType === 'Income'
        ? newAmount + originalAmount
        : -(newAmount + originalAmount);
    }
  
    const wasUpdated = await this.categorizeBudgetService.update(
      transaction.categorizedBudget.id,
      newType === 'Income'
        ? { newIncome: amountDifference }
        : { newExpense: amountDifference },
      user.id,
    );
  
    if (!wasUpdated) {
      throw new UnauthorizedException('You are not authorized to update this budget');
    }
  
    Object.assign(transaction, updateDto);
    return await this.transactionRepository.save(transaction);
  }
  

  async remove(id: number, user: User) {
    const transaction = await this.findOne(id, user);
  
    const adjustmentAmount = transaction.type === 'Income'
      ? -transaction.amount
      : transaction.amount;
  
    // Actualizar CategorizedBudget para ajustar el presupuesto
    const wasUpdated = await this.categorizeBudgetService.update(
      transaction.categorizedBudget.id,
      transaction.type === 'Income'
        ? { newIncome: adjustmentAmount }
        : { newExpense: adjustmentAmount },
      user.id,
    );
  
    if (!wasUpdated) {
      throw new UnauthorizedException('You are not authorized to update this budget');
    }
  
    await this.transactionRepository.remove(transaction);
    return { message: `Transaction with ID ${id} deleted successfully.` };
  }
  
}
