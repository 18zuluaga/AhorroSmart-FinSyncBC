import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiDocValidateUser } from './docs/validate.swagger.decorator';
import { ApiDocLogin } from './docs/auth.swagger.decorator';
import { User } from 'src/users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiDocValidateUser(User)
  @Post('validate')
  validate(@Request() req) {
    const user = req.user as User;
    return user;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiDocLogin()
  async signIn(@Body() signInDto: LoginDto) {
    return this.authService.login({
      email: signInDto.email,
      password: signInDto.password,
    });
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}
