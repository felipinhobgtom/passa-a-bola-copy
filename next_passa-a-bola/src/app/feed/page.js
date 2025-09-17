'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import CreatePostForm from '../components/CreatePostForm';
import PostCard from '../components/PostCard';
import Sidebar from '../components/Sidebar'
import { FaUser, FaSearch, FaNewspaper, FaCalendarAlt, FaHandHoldingHeart, FaSpinner } from 'react-icons/fa';
import API_URL, { apiPath } from '@/config/api';
import Link from 'next/link';
// Using centralized API_URL from config

export default function FeedPage() {
    const { userRole } = useAuth();
    const [feed, setFeed] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchFeed = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setIsLoading(false);
            return;
        }
        try {

            const res = await fetch(apiPath('/api/feed'), {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Falha ao buscar o feed');
            const data = await res.json();
            setFeed(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFeed();
    }, []);

    const isPlayer = userRole === 'jogadora_amadora' || userRole === 'jogadora_profissional';

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-[#1A202C] text-white">
                <FaSpinner className="animate-spin text-5xl text-[#E84F7F]" />
                <p className="mt-4 text-lg">Carregando o campo...</p>
            </div>
        );
    }

    return (
        <div className="bg-[#1A202C] min-h-screen text-white p-4 sm:p-8">
            <div className="container mx-auto">
                <header className="mb-8">
                    <h1 className="text-5xl font-extrabold text-[#E84F7F]">Feed de Atividades</h1>
                    <p className="text-gray-400 mt-2">Acompanhe as últimas jogadas e atualizações da comunidade.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Coluna Principal do Feed (Esquerda) */}
                    <main className="lg:col-span-2">
                        {isPlayer && <CreatePostForm onPostCreated={fetchFeed} />}

                        {feed.length > 0 ? (
                            <div className="space-y-6">
                                {feed.map(post => (
                                    <PostCard key={post._id} post={post} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center bg-[#2D3748] p-10 rounded-xl">
                                <h3 className="text-2xl font-bold">O campo está silencioso...</h3>
                                <p className="text-gray-400 mt-2">Ainda não há nenhuma publicação no feed. Que tal ser a primeira?</p>
                            </div>
                        )}
                    </main>

                    
                    <Sidebar />
                </div>
            </div>
        </div>
    );
}