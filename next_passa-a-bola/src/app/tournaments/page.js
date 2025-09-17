'use client';
import API_URL, { apiPath } from '@/config/api';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TournamentCard from '../components/TournamentCard';
import { FaSpinner, FaTrophy, FaPlus } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext'; // Import useAuth to get user info

export default function TournamentsPage() {
    const [tournaments, setTournaments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { userRole } = useAuth(); // Use context to get userRole for consistency

    const primaryPink = '#E84F7F';
    const primaryGreen = '#4CAF50';

    useEffect(() => {
        async function fetchTournaments() {
            // **CORRECTION: Get the token to send with the request**
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setIsLoading(false);
                return; // Stop if the user is not logged in
            }

            try {
                const res = await fetch(apiPath('/api/tournaments/'), {
                    // **CORRECTION: Add Authorization header**
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!res.ok) throw new Error('Falha ao buscar torneios');
                
                const data = await res.json();
                setTournaments(data);
            } catch (error) {
                console.error("Erro ao buscar torneios:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchTournaments();
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-[#1A202C] text-white">
                <FaSpinner className="animate-spin text-5xl" style={{ color: primaryPink }} />
                <p className="mt-4 text-lg">A carregar competições...</p>
            </div>
        );
    }

    return (
        <div className="bg-[#1A202C] min-h-screen text-white">
            {/* Hero Section */}
            <div 
                className="text-center p-12 md:p-20 bg-cover bg-center"
                style={{ backgroundImage: "url('/trophy-bg.jpg')" }}
            >
                <div className="bg-black/70 p-8 rounded-xl backdrop-blur-sm">
                    <FaTrophy className="mx-auto text-6xl mb-4" style={{ color: primaryPink }}/>
                    <h1 className="text-5xl md:text-7xl font-extrabold">A Batalha Pela Glória</h1>
                    <p className="text-xl mt-4 text-gray-200 max-w-3xl mx-auto">
                        Encontre o seu próximo desafio e mostre o seu talento nos maiores torneios de futebol feminino.
                    </p>
                </div>
            </div>
            
            <div className="container mx-auto p-8">
                {userRole === 'admin' && (
                    <div className="text-right mb-8">
                        <Link 
                            href="/tournaments/create" 
                            className="inline-flex items-center gap-2 font-bold py-2 px-5 rounded-lg text-white transition-transform transform hover:scale-105"
                            style={{ backgroundColor: primaryGreen }}
                        >
                            <FaPlus /> Criar Novo Torneio
                        </Link>
                    </div>
                )}

                {tournaments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {tournaments.map(tournament => (
                            <TournamentCard key={tournament._id} tournament={tournament} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center bg-[#2D3748] p-10 rounded-xl max-w-2xl mx-auto">
                        <FaTrophy className="mx-auto text-6xl mb-4 text-gray-500"/>
                        <h3 className="text-2xl font-bold">Nenhum Torneio Agendado</h3>
                        <p className="text-gray-400 mt-2">
                            Ainda não há competições no calendário. Fique atento para futuras oportunidades!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}