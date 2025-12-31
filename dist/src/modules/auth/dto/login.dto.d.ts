export declare class LoginAuthDto {
    user_name: string;
    pass: string;
}
export interface UserValidated {
    id: number;
    user_name: string;
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
        };
    }[];
}
