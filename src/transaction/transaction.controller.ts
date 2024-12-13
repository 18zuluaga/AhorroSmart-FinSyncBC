import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Delete,
  Param,
  UseGuards,
  Request,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@Controller('transactions')
@ApiTags('Transactions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva transacción' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Transacción creada exitosamente.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'No autorizado.' })
  async create(@Body() createTransactionDto: CreateTransactionDto, @Request() req) {
    return this.transactionService.create(createTransactionDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener transacciones filtradas por fecha opcional' })
  @ApiQuery({
    name: 'date',
    required: false,
    type: String,
    description: 'Fecha opcional en formato ISO 8601 para filtrar las transacciones',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Listado de transacciones obtenido con éxito.' })
  async findAll(
    @Request() req,
    @Query('date') date?: string,
  ) {
    const { user } = req;
    const parsedDate = date ? new Date(date) : undefined;
    return this.transactionService.findAll(user, parsedDate);
  }
  

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una transacción por ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Transacción encontrada.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Transacción no encontrada.' })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.transactionService.findOne(+id, req.user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una transacción existente' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Transacción actualizada exitosamente.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Transacción no encontrada.' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: Partial<CreateTransactionDto>,
    @Request() req
  ) {
    return this.transactionService.update(+id, updateDto, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una transacción' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Transacción eliminada exitosamente.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Transacción no encontrada.' })
  async remove(@Param('id') id: string, @Request() req) {
    return this.transactionService.remove(+id, req.user);
  }
}
