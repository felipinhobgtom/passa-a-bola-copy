'use client';
import API_URL, { apiPath } from '@/config/api';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SocialProjectCard from '../components/SocialProjectCard';
import { useAuth } from '../context/AuthContext';
import { FaSpinner, FaHandHoldingHeart, FaPlus } from 'react-icons/fa';

export default function SocialProjectsPage() {
    const { userRole, isLoggedIn } = useAuth();
    const [projects, setProjects] = useState([]);
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

        async function fetchProjects() {
            try {
                const res = await fetch(apiPath('/api/social-projects/'), {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!res.ok) throw new Error('Falha ao buscar projetos');
                const data = await res.json();
                setProjects(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchProjects();
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-[#1A202C] text-white">
                <FaSpinner className="animate-spin text-5xl" style={{ color: primaryPink }} />
                <p className="mt-4 text-lg">Carregando projetos...</p>
            </div>
        );
    }

    return (
        <div className="bg-[#1A202C] min-h-screen text-white">
            {/* Hero Section */}
            <div 
                className="text-center p-12 md:p-20 bg-cover bg-center"
                style={{ backgroundImage: "url('/community-bg.jpg')" }} // Adicione uma imagem de fundo inspiradora na pasta /public
            >
                <div className="bg-black/60 p-8 rounded-xl backdrop-blur-sm">
                    <FaHandHoldingHeart className="mx-auto text-6xl mb-4" style={{ color: primaryPink }}/>
                    <h1 className="text-5xl md:text-7xl font-extrabold">Jogue Junto, Transforme Vidas</h1>
                    <p className="text-xl mt-4 text-gray-200 max-w-3xl mx-auto">
                        Conheça e apoie projetos incríveis que usam o futebol feminino como ferramenta de inclusão e transformação social.
                    </p>
                </div>
            </div>
            
            <div className="container mx-auto p-8">
                {userRole === 'admin' && (
                    <div className="text-right mb-8">
                        <Link 
                            href="/projetos-sociais/create" 
                            className="inline-flex items-center gap-2 font-bold py-2 px-5 rounded-lg text-white transition-transform transform hover:scale-105"
                            style={{ backgroundColor: primaryGreen }}
                        >
                            <FaPlus /> Adicionar Projeto
                        </Link>
                    </div>
                )}

                {!projects.length ? (
                    <div className="text-center bg-[#2D3748] p-10 rounded-xl max-w-2xl mx-auto">
                        <FaHandHoldingHeart className="mx-auto text-6xl mb-4 text-gray-500"/>
                        <h3 className="text-2xl font-bold">Nenhum Projeto Encontrado</h3>
                        <p className="text-gray-400 mt-2">
                            Ainda não há projetos sociais cadastrados. Volte em breve!
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
                        {projects.map(project => (
                            <SocialProjectCard key={project._id} project={project} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}