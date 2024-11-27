import {
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsNotEmpty,
  IsObject,
} from 'class-validator';
import { LatLng } from 'src/common/interfaces/region.interface';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsPhoneNumber(null)
  @IsNotEmpty()
  phoneNumber: string;

  @IsObject()
  location: LatLng;

  @IsString()
  @IsNotEmpty()
  password: string;
}
