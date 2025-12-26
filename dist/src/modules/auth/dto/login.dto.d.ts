export declare class LoginAuthDto {
    user_name: string;
    pass: string;
}
export interface UserValidated {
    id: number;
    user_name: string;
    person_id?: number | null;
    first_login?: boolean;
}
