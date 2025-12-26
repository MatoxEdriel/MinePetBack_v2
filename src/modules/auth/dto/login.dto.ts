import { IsNotEmpty, IsString } from 'class-validator';

export class LoginAuthDto {
    @IsString()
    @IsNotEmpty()
    user_name: string;

    @IsString()
    @IsNotEmpty()
    pass: string;
}

export interface UserValidated {
    id: number;
    user_name: string;
    person_id?: number | null;
    first_login?: boolean;
}