export enum UserRole {
    TEACHER = 'teacher',
    STUDENT = 'student',
    PARTICIPANT = 'participant'  
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials extends LoginCredentials {
    username: string;
    phone: string;
    adress: string;
    role: UserRole;
}

export interface User {
    _id: string;
    email: string;
    username: string;
    role: string;
}

export interface AuthResponse {
    access_token: string;
    user: User;
}
