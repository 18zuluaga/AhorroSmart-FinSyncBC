import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Inicio de sesión' })
  @ApiResponse({ status: 200, description: 'Usuario autenticado correctamente' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async signIn(@Body() signInDto: LoginDto) {
    return this.authService.login(signInDto);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registro de usuario' })
  @ApiResponse({ status: 201, description: 'Usuario registrado correctamente' })
  @ApiResponse({ status: 400, description: 'Datos de registro inválidos' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}
