import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';
import { User } from '../types/auth.types';

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (token: string, userData: User) => void;
    logout: () => void;
    hasRole: (role: string | string[]) => boolean;
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    user: null,
    login: () => {},
    logout: () => {},
    hasRole: () => false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            const savedUser = localStorage.getItem('user');
            
            if (token && savedUser) {
                const userData = JSON.parse(savedUser);
                setIsAuthenticated(true);
                setUser(userData);
                authService.setToken(token);
            }
        };

        initAuth();
    }, []);

    const login = (token: string, userData: User) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        authService.setToken(token);
        setIsAuthenticated(true);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        authService.logout();
        setIsAuthenticated(false);
        setUser(null);
    };

    const hasRole = (role: string | string[]): boolean => {
        if (!user) return false;
        
        if (Array.isArray(role)) {
            return role.includes(user.role);
        }
        
        return user.role === role;
    };

    const value = {
        isAuthenticated,
        user,
        login,
        logout,
        hasRole,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
