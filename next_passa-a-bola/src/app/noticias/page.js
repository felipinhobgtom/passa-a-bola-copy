'use client';
import API_URL from '@/config/api';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ArticleCard from '../components/ArticleCard';
import { useAuth } from '../context/AuthContext';
import { FaSpinner, FaNewspaper, FaPlus } from 'react-icons/fa';

export default function NewsPage() {
    const { userRole, isLoggedIn } = useAuth();
    const [articles, setArticles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const primaryPink = '#E84F7F';
    const primaryPurple = '#8A2BE2';
    const primaryGreen = '#4CAF50';

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setIsLoading(false);
            return;
        }

        async function fetchArticles() {
            try {
                const res = await fetch(`${API_URL}/api/news/`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!res.ok) throw new Error('Falha ao buscar notícias');
                const data = await res.json();
                setArticles(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchArticles();
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-[#1A202C] text-white">
                <FaSpinner className="animate-spin text-5xl" style={{ color: primaryPink }} />
                <p className="mt-4 text-lg">Buscando as manchetes...</p>
            </div>
        );
    }

    return (
        <div className="bg-[#1A202C] min-h-screen text-white">
            {/* Hero Section */}
            <div className="text-center p-12 md:p-20 bg-gradient-to-r" style={{ from: primaryPink, to: primaryPurple }}>
                <h1 className="text-5xl md:text-7xl font-extrabold">Últimas Notícias</h1>
                <p className="text-xl mt-4 text-gray-200">Fique por dentro de tudo que acontece no universo do futebol feminino.</p>
            </div>
            
            <div className="container mx-auto p-8">
                {/* Botão de Admin */}
                {userRole === 'admin' && (
                    <div className="text-right mb-8">
                        <Link 
                            href="/noticias/create" 
                            className="inline-flex items-center gap-2 font-bold py-2 px-5 rounded-lg text-white transition-transform transform hover:scale-105"
                            style={{ backgroundColor: primaryGreen }}
                        >
                            <FaPlus /> Criar Artigo
                        </Link>
                    </div>
                )}

                {/* Grid de Notícias ou Estado de Vazio */}
                {!articles.length ? (
                    <div className="text-center bg-[#2D3748] p-10 rounded-xl max-w-2xl mx-auto">
                        <FaNewspaper className="mx-auto text-6xl mb-4" style={{ color: mutedColor }}/>
                        <h3 className="text-2xl font-bold">Nenhuma notícia encontrada</h3>
                        <p className="text-gray-400 mt-2">
                            Parece que você não está logado ou não há notícias disponíveis no momento.
                        </p>
                        {!isLoggedIn && (
                             <Link 
                                href="/login" 
                                className="inline-block mt-6 font-bold py-2 px-6 rounded-lg text-white" 
                                style={{ backgroundColor: primaryPurple }}
                            >
                                Fazer Login
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {articles.map(article => (
                            <ArticleCard key={article.url} article={article} /> // Usar URL como chave é mais seguro para notícias externas
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}