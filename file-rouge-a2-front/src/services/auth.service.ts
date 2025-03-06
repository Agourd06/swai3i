import axios from 'axios';
import { LoginCredentials, RegisterCredentials, AuthResponse } from '../types/auth.types';

const API_URL = 'http://localhost:3000'; 

axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

class AuthService {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, credentials);
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    async register(credentials: RegisterCredentials): Promise<AuthResponse> {
        try {
            const response = await axios.post(`${API_URL}/auth/signup`, credentials);
            return response.data;
        } catch (error) {
            console.error('Register error:', error);
            throw error;
        }
    }

    setToken(token: string) {
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    logout() {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }
}

export const authService = new AuthService();
