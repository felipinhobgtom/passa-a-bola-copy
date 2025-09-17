'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import API_URL from '@/config/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [user, setUser] = useState(null); // NOVO: Estado para guardar o perfil do utilizador
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const role = localStorage.getItem('userRole');
        const storedUser = localStorage.getItem('userProfile'); // NOVO

        if (token && role) {
            setIsLoggedIn(true);
            setUserRole(role);
            if (storedUser) {
                setUser(JSON.parse(storedUser)); // NOVO: Carrega o perfil do localStorage
            }
        }
    }, []);

    const login = async (token, role) => {
        localStorage.setItem('accessToken', token);
        localStorage.setItem('userRole', role);
        setIsLoggedIn(true);
        setUserRole(role);

        // MODIFICADO: Busca o perfil do utilizador após o login
        try {
            const res = await fetch(`${API_URL}/api/profiles/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                const profileData = await res.json();
                setUser(profileData);
                localStorage.setItem('userProfile', JSON.stringify(profileData));
            } else if (res.status !== 404) { // Ignora o 404 se o perfil não existir ainda
                console.error("Erro ao buscar perfil.");
            }
        } catch (error) {
            console.error("Falha ao conectar para buscar perfil:", error);
        }

        router.push('/feed');
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userProfile'); // NOVO: Limpa o perfil
        setIsLoggedIn(false);
        setUserRole(null);
        setUser(null); // NOVO: Limpa o estado
        router.push('/login');
    };

    // NOVO: Expõe 'user' no contexto
    const value = { isLoggedIn, userRole, user, login, logout };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}