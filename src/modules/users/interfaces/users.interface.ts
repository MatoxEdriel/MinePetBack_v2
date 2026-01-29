export interface IUser {
    id: number;
    user_name: string | null;
    persons: {
        name: string | null;
        last_name: string | null;
        email: string | null;
        phone: string | null;
        address: string | null;
    } | null
}