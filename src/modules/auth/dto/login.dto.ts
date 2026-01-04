import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginAuthDto {
    @IsString()
    @IsNotEmpty()
    user_name: string;

    @IsString()
    @IsNotEmpty()
    pass: string;
}


export class ChangePasswordDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres ' })
    pass: string;
}


export interface UserValidated {
    id: number;
    user_name: string | null;
    persons?: {
        name: string;
        last_name: string;
        email: string;
    } | null;
    first_login?: boolean;
    role: number;
    user_roles: {
        roles: {
            id: number;
            name: string;
        }
    }[];
}