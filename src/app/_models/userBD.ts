/* Defines the User entity */
export class UserBD {
    id: number;
    token: string;
    email:string;
    password: string;
    isAuthenticated: boolean;
}