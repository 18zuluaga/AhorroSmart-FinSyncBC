import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BudgetService } from './budget.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('budget')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createBudgetDto: CreateBudgetDto, @Request() req) {
    const user = req.user;
    return this.budgetService.create(createBudgetDto, user.id);
  }

  @Get()
  findAll(@Request() req) {
    const user = req.user;
    console.log(user);
    return this.budgetService.findAll(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':date')
  findByDate(@Param('date') date: string, @Request() req) {
    const dateParse = new Date(date);
    const user = req.user;
    return this.budgetService.findByDate(dateParse, user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    const user = req.user;
    return this.budgetService.findOne(+id, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBudgetDto: UpdateBudgetDto,
    @Request() req,
  ) {
    const user = req.user;
    return this.budgetService.update(+id, updateBudgetDto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    const user = req.user;
    return this.budgetService.remove(+id, user.id);
  }
}
