'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import API_URL, { apiPath } from '@/config/api';
import Image from 'next/image'; // Importar o componente Image do Next.js

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [role, setRole] = useState('torcedor');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const router = useRouter();

    // Definindo as cores da paleta
    const primaryPink = '#E84F7F'; // Rosa vibrante
    const primaryPurple = '#8A2BE2'; // Roxo vibrante
    const primaryGreen = '#4CAF50'; // Verde (para sucesso)
    const darkBg = '#1A202C'; // Fundo mais escuro
    const cardBg = 'rgba(45, 55, 72, 0.9)'; // Fundo do card semi-transparente
    const inputBg = '#4A5568'; // Fundo dos inputs
    const borderColor = '#4A5568'; // Cor da borda dos inputs
    const errorRed = '#EF4444'; // Vermelho para erros

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);

        try {
            const res = await fetch(apiPath('/auth/register'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha, role }),
            });

            if (res.ok) {
                setMessage('Cadastro realizado com sucesso! Redirecionando para login...');
                setIsError(false);
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else {
                const data = await res.json();
                setMessage(data.detail || 'Ocorreu um erro no cadastro.');
                setIsError(true);
            }
        } catch (error) {
            setMessage('Não foi possível conectar ao servidor. Tente novamente mais tarde.');
            setIsError(true);
        }
    };

    return (
        <div 
            className={`relative flex justify-center items-center min-h-screen bg-[${darkBg}] p-4 overflow-hidden`}
            // Fundo da página com uma imagem inspiradora do futebol feminino
            style={{ 
                backgroundImage: "url('https://images.unsplash.com/photo-1616763789578-831e537c3a2f?q=80&w=2070&auto=format&fit=crop')", // Imagem de fundo de futebol feminino
                backgroundSize: 'cover', 
                backgroundPosition: 'center' 
            }}
        >
            {/* Overlay para escurecer o fundo e garantir legibilidade */}
            <div className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm"></div>

            <div 
                className={`relative z-10 w-full max-w-md p-8 rounded-xl shadow-2xl animate-fade-in`}
                style={{ backgroundColor: cardBg, border: `1px solid ${primaryPurple}` }} // Card do formulário com semi-transparência e borda
            >
                <div className="text-center mb-8">
                    {/* Exemplo de como você poderia adicionar um logo no formulário, se desejar */}
                    {/* <Image src="/logo-passa-a-bola.png" alt="Logo Passa a Bola" width={80} height={80} className="mx-auto mb-4" /> */}
                    <h1 className="text-4xl font-extrabold" style={{ color: primaryPink }}>
                        Crie Sua Conta
                    </h1>
                    <p className="text-gray-300 mt-2">Junte-se ao movimento do futebol feminino!</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {message && (
                        <p 
                            className={`text-center mb-4 p-3 rounded-lg font-medium`}
                            style={{ 
                                backgroundColor: isError ? errorRed + '30' : primaryGreen + '30', // Fundo levemente transparente
                                color: isError ? errorRed : primaryGreen,
                                border: `1px solid ${isError ? errorRed : primaryGreen}`
                            }}
                        >
                            {message}
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

                    <div className="mb-6">
                        <label htmlFor="role" className="block text-gray-200 text-sm font-semibold mb-2">Eu sou:</label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                            className={`w-full p-3 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[${primaryPink}]`}
                            style={{ 
                                backgroundColor: inputBg, 
                                border: `1px solid ${borderColor}`, 
                                color: 'white',
                                // Adiciona um ícone de seta customizado para o select
                                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23cbd5e0' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 0.75rem center',
                                backgroundSize: '0.8em 0.8em',
                            }}
                        >
                            <option value="torcedor">Torcedor(a)</option>
                            <option value="jogadora_amadora">Jogadora Amadora</option>
                            <option value="jogadora_profissional">Jogadora (Quero ser Profissional)</option>
                            <option value="olheiro">Olheiro(a)</option>
                            <option value="admin">Organizador(a) de Eventos (Admin)</option>
                        </select>
                    </div>

                    <button 
                        type="submit" 
                        className={`w-full p-3 rounded-lg font-bold text-lg transition-transform transform hover:scale-105 shadow-md`}
                        style={{ backgroundColor: primaryPink, color: 'white' }} // Botão de cadastro em rosa
                    >
                        Cadastrar
                    </button>

                    <p className="text-center text-gray-400 mt-6">
                        Já tem uma conta?{' '}
                        <Link href="/login" className={`font-semibold hover:underline`} style={{ color: primaryPurple }}>
                            Faça login
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}