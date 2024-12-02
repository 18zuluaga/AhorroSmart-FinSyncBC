import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { UserService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    try {
      const user: User = await this.usersService.findOneByEmail(
        email.toLowerCase().trim(),
      );

      if (!user) {
        throw new NotFoundException(
          'User not found, Verify your credentials or create an account',
        );
      }

      console.log(user);

      const isMatch = await bcrypt.compare(pass, user.password);

      console.log(isMatch);
      
      if (!isMatch) {
        throw new NotFoundException(
          'User not found, Verify your credentials or contact your administrator to register',
        );
      }
      delete user.password;
      return user;
    } catch (error) {
      throw error;
    }
  }

  async login(user: LoginDto) {
    try {
      const verifiedUser: User = await this.validateUser(
        user.email,
        user.password,
      );

      console.log(user);
      

      const payload = { ...verifiedUser };

      console.log(payload);
      

      return {
        token: this.jwtService.sign(payload),
      };
    } catch (error) {
      throw error;
    }
  }

  async register(userDto: RegisterDto) {
    try {
      console.log(userDto);
      const email = userDto.email.toLowerCase().trim(); 
      const hashedPassword = await bcrypt.hash(userDto.password.trim(), 10);

      const newUser = await this.usersService.create({
        ...userDto,
        email: email,
        password: hashedPassword,
      });

      delete newUser.password;
      const token = await this.login({
        email: newUser.email,
        password: userDto.password,
      });

      return {
        user: newUser,
        token: token.token,
      };
    } catch (error) {
      throw error;
    }
  }
}
