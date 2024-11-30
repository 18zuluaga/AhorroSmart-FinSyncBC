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
import { CategorizeBudgetService } from './categorize-budget.service';
import { CreateCategorizedBudgetDto } from './dto/create-categorize-budget.dto';
import { UpdateCategorizeBudgetDto } from './dto/update-categorize-budget.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { CategorizedBudget } from './entities/categorize-budget.entity';

@ApiTags('Categorize Budget')
@Controller('categorize-budget')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class CategorizeBudgetController {
  constructor(
    private readonly categorizeBudgetService: CategorizeBudgetService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new categorized budget' })
  @ApiResponse({ status: 201, description: 'Categorized budget created successfully.', type: CategorizedBudget })
  @ApiResponse({ status: 404, description: 'User not found.' })
  create(@Body() createCategorizeBudgetDto: CreateCategorizedBudgetDto, @Request() req) {
    return this.categorizeBudgetService.create(createCategorizeBudgetDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categorized budgets for a user' })
  @ApiResponse({ status: 200, description: 'List of categorized budgets.', type: [CategorizedBudget] })
  findAll(@Request() req) {
    return this.categorizeBudgetService.findAll(req.user.id);
  }

  @Get(':date')
  @ApiOperation({ summary: 'Get a categorized budget by date' })
  @ApiResponse({ status: 200, description: 'Categorized budget details.', type: CategorizedBudget })
  @ApiResponse({ status: 404, description: 'Categorized budget not found.' })
  findByDate(@Param('date') date: string, @Request() req) {
    return this.categorizeBudgetService.findByDate(date, req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific categorized budget by ID' })
  @ApiResponse({ status: 200, description: 'Categorized budget details.', type: CategorizedBudget })
  @ApiResponse({ status: 404, description: 'Categorized budget not found.' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.categorizeBudgetService.findOne(+id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a categorized budget by ID' })
  @ApiResponse({ status: 200, description: 'Categorized budget updated successfully.' })
  @ApiResponse({ status: 404, description: 'Categorized budget not found.' })
  update(@Param('id') id: string, @Body() updateCategorizeBudgetDto: UpdateCategorizeBudgetDto, @Request() req) {
    return this.categorizeBudgetService.update(+id, updateCategorizeBudgetDto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a categorized budget by ID' })
  @ApiResponse({ status: 200, description: 'Categorized budget deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Categorized budget not found.' })
  remove(@Param('id') id: string, @Request() req) {
    return this.categorizeBudgetService.remove(+id, req.user.id);
  }
}
