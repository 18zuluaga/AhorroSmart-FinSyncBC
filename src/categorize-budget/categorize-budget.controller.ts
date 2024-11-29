import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategorizeBudgetService } from './categorize-budget.service';
import { CreateCategorizedBudgetDto } from './dto/create-categorize-budget.dto';
import { UpdateCategorizeBudgetDto } from './dto/update-categorize-budget.dto';

@Controller('categorize-budget')
export class CategorizeBudgetController {
  constructor(private readonly categorizeBudgetService: CategorizeBudgetService) {}

  @Post()
  create(@Body() createCategorizeBudgetDto: CreateCategorizedBudgetDto) {
    return this.categorizeBudgetService.create(createCategorizeBudgetDto);
  }

  @Get()
  findAll() {
    return this.categorizeBudgetService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categorizeBudgetService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategorizeBudgetDto: UpdateCategorizeBudgetDto) {
    return this.categorizeBudgetService.update(+id, updateCategorizeBudgetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categorizeBudgetService.remove(+id);
  }
}
