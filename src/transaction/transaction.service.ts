import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto, user: User) {
    const transaction = this.transactionRepository.create({
      ...createTransactionDto,
      user,
      date: new Date(),
    });

    return await this.transactionRepository.save(transaction);
  }

  async findAll(user: User) {
    return await this.transactionRepository.find({ where: { user } });
  }

  async findOne(id: number, user: User) {
    const transaction = await this.transactionRepository.findOne({ where: { id, user } });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found.`);
    }

    return transaction;
  }

  async update(id: number, updateDto: Partial<CreateTransactionDto>, user: User) {
    const transaction = await this.findOne(id, user);
    Object.assign(transaction, updateDto);

    return await this.transactionRepository.save(transaction);
  }

  async remove(id: number, user: User) {
    const transaction = await this.findOne(id, user);
    await this.transactionRepository.remove(transaction);
    return { message: `Transaction with ID ${id} deleted successfully.` };
  }
}
