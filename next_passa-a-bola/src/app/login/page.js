'use client';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import API_URL from '@/config/api';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    // Paleta de cores para consistência
    const primaryPink = '#E84F7F';
    const primaryPurple = '#8A2BE2';
    const darkBg = '#1A202C';
    const cardBg = 'rgba(45, 55, 72, 0.9)';
    const inputBg = '#4A5568';
    const borderColor = '#4A5568';
    const errorRed = '#EF4444';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const formData = new FormData();
        formData.append('username', email);
        formData.append('password', senha);

        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                login(data.access_token, data.role);
                // O redirecionamento será tratado pelo AuthContext
            } else {
                const data = await res.json();
                setError(data.detail || 'Email ou senha inválidos.');
            }
        } catch (err) {
            setError('Não foi possível conectar ao servidor. Tente novamente.');
        }
    };

    return (
        <div 
            className={`relative flex justify-center items-center min-h-screen bg-[${darkBg}] p-4 overflow-hidden`}
            style={{ 
                backgroundImage: "url('https://images.unsplash.com/photo-1593341646782-e01604b15e35?q=80&w=1974&auto-format=fit=crop')",
                backgroundSize: 'cover', 
                backgroundPosition: 'center' 
            }}
        >
            <div className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm"></div>

            <div 
                className={`relative z-10 w-full max-w-md p-8 rounded-xl shadow-2xl animate-fade-in`}
                style={{ backgroundColor: cardBg, border: `1px solid ${primaryPink}` }}
            >
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold" style={{ color: primaryPink }}>
                        Bem-vinda de Volta!
                    </h1>
                    <p className="text-gray-300 mt-2">Acesse sua conta para continuar.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <p 
                            className={`text-center mb-4 p-3 rounded-lg font-medium`}
                            style={{ 
                                backgroundColor: errorRed + '30',
                                color: errorRed,
                                border: `1px solid ${errorRed}`
                            }}
                        >
                            {error}
                        </p>
                    )}
                    
                    <div>
                        <label htmlFor="email" className="block text-gray-200 text-sm font-semibold mb-2">Email</label>
                        <input 
                            type="email" 
                            id="email"
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            className={`w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[${primaryPink}]`}
                            style={{ backgroundColor: inputBg, border: `1px solid ${borderColor}`, color: 'white' }}
                        />
                    </div>
                    <div>
                        <label htmlFor="senha" className="block text-gray-200 text-sm font-semibold mb-2">Senha</label>
                        <input 
                            type="password" 
                            id="senha"
                            value={senha} 
                            onChange={(e) => setSenha(e.target.value)} 
                            required 
                            className={`w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[${primaryPink}]`}
                            style={{ backgroundColor: inputBg, border: `1px solid ${borderColor}`, color: 'white' }}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className={`w-full p-3 rounded-lg font-bold text-lg transition-transform transform hover:scale-105 shadow-md`}
                        style={{ backgroundColor: primaryPink, color: 'white' }}
                    >
                        Entrar
                    </button>

                    <p className="text-center text-gray-400 mt-6">
                        Ainda não faz parte?{' '}
                        <Link href="/register" className={`font-semibold hover:underline`} style={{ color: primaryPurple }}>
                            Cadastre-se
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}