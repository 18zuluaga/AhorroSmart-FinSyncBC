import {
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsNotEmpty,
  IsObject,
  MinLength,
} from 'class-validator';
import { LatLng } from 'src/common/interfaces/region.interface';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
