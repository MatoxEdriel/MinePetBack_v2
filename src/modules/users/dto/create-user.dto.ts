import { 
  IsString, 
  IsEmail, 
  IsNotEmpty, 
  MinLength, 
  IsOptional, 
  IsInt, 
  IsDateString 
} from 'class-validator';

export class CreateUserDto {
  
  @IsString({ message: 'El nombre de usuario debe ser texto' })
  @IsNotEmpty({ message: 'El nombre de usuario es obligatorio' })
  user_name: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  last_name: string;

  @IsEmail({}, { message: 'El formato del correo no es válido' })
  @IsNotEmpty()
  email: string;

  
  @IsInt({ message: 'El tipo de identificación debe ser un número (ID)' })
  @IsOptional()
  type_id?: number; 

  @IsDateString({}, { message: 'La fecha debe ser formato ISO8601 (YYYY-MM-DD)' })
  @IsOptional()
  birthday_day?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  address?: string;
}