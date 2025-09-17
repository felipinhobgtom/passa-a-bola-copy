'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaPlus, FaSpinner, FaArrowLeft, FaTrophy, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import API_URL from '@/config/api';

export default function CreateTournamentPage() {
    // Added states for the new, necessary fields
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false); // Added loading state
    const router = useRouter();

    // Brand Colors
    const primaryPink = '#E84F7F';
    const primaryPurple = '#8A2BE2';
    const primaryGreen = '#4CAF50';
    const cardBg = '#2D3748';
    const inputBg = '#4A5568';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        const token = localStorage.getItem('accessToken');
        if (!token) {
            setError("Você não está autenticado. Faça o login novamente.");
            setIsSubmitting(false);
            return;
        }

        // Include all tournament fields in the request body
        const tournamentData = {
            name,
            description,
            location,
            start_date: new Date(startDate).toISOString(),
            end_date: new Date(endDate).toISOString(),
            registration_open: true, // Default to open
            teams: [] // Teams will be managed separately
        };

        try {
            const res = await fetch(`${API_URL}/api/tournaments/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(tournamentData),
            });

            if (res.ok) {
                router.push('/tournaments');
                router.refresh();
            } else if (res.status === 403) {
                setError("Você não tem permissão de administrador para criar um torneio.");
            } else {
                const data = await res.json();
                setError(data.detail || "Falha ao criar o torneio.");
            }
        } catch (err) {
            setError("Erro de conexão. Tente novamente mais tarde.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-[#1A202C] min-h-screen text-white p-4 sm:p-8">
            <div className="max-w-3xl mx-auto">
                <header className="mb-8">
                    <Link href="/tournaments" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4">
                        <FaArrowLeft /> Voltar para Torneios
                    </Link>
                    <h1 className="text-5xl font-extrabold" style={{ color: primaryPink }}>Criar Novo Torneio</h1>
                    <p className="text-gray-400 mt-2">Preencha os detalhes abaixo para agendar uma nova competição na plataforma.</p>
                </header>
                
                <form onSubmit={handleSubmit} className="p-8 rounded-xl space-y-8" style={{ backgroundColor: cardBg }}>
                    {error && (
                        <p className="text-red-300 bg-red-500/20 border border-red-500 p-3 rounded-lg font-semibold">{error}</p>
                    )}

                    <fieldset>
                        <legend className="text-2xl font-bold mb-4 flex items-center gap-3" style={{ color: primaryPurple }}><FaTrophy /> Detalhes do Torneio</legend>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold mb-2 text-gray-300">Nome do Torneio</label>
                                <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className={`w-full p-3 rounded-lg bg-[${inputBg}] border border-transparent focus:outline-none focus:ring-2 focus:ring-[${primaryPurple}]`} />
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-semibold mb-2 text-gray-300">Descrição</label>
                                <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required className={`w-full p-3 rounded-lg bg-[${inputBg}] h-28 resize-none border border-transparent focus:outline-none focus:ring-2 focus:ring-[${primaryPurple}]`} />
                            </div>
                            <div>
                                <label htmlFor="location" className="block text-sm font-semibold mb-2 text-gray-300">Localização</label>
                                <input id="location" type="text" value={location} onChange={(e) => setLocation(e.target.value)} required placeholder="Ex: São Paulo, SP" className={`w-full p-3 rounded-lg bg-[${inputBg}] border border-transparent focus:outline-none focus:ring-2 focus:ring-[${primaryPurple}]`} />
                            </div>
                        </div>
                    </fieldset>

                     <fieldset>
                        <legend className="text-2xl font-bold mb-4 flex items-center gap-3" style={{ color: primaryPurple }}><FaCalendarAlt /> Período</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="startDate" className="block text-sm font-semibold mb-2 text-gray-300">Data de Início</label>
                                <input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required className={`w-full p-3 rounded-lg bg-[${inputBg}] border border-transparent focus:outline-none focus:ring-2 focus:ring-[${primaryPurple}]`} />
                            </div>
                             <div>
                                <label htmlFor="endDate" className="block text-sm font-semibold mb-2 text-gray-300">Data de Término</label>
                                <input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required className={`w-full p-3 rounded-lg bg-[${inputBg}] border border-transparent focus:outline-none focus:ring-2 focus:ring-[${primaryPurple}]`} />
                            </div>
                        </div>
                    </fieldset>

                    <button type="submit" disabled={isSubmitting} className="w-full flex justify-center items-center gap-2 font-bold py-3 px-4 rounded-lg text-lg text-white transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed" style={{ backgroundColor: primaryGreen }}>
                        {isSubmitting ? (
                            <><FaSpinner className="animate-spin" /> Criando...</>
                        ) : (
                            <><FaPlus /> Criar Torneio</>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}