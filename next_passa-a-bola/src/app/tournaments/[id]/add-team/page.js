'use client';
import API_URL, { apiPath } from '@/config/api';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { FaPlus, FaSpinner, FaArrowLeft, FaUsers } from 'react-icons/fa';

export default function AddTeamPage() {
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const params = useParams();
    const tournamentId = params.id;

    // ... (Cores da Paleta)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        const token = localStorage.getItem('accessToken');
        
        try {
            const res = await fetch(apiPath(`/api/tournaments/${tournamentId}/teams`), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name }),
            });

            if (res.ok) {
                router.push(`/tournaments/${tournamentId}`);
                router.refresh();
            } else {
                const data = await res.json();
                setError(data.detail || "Falha ao adicionar a equipe.");
            }
        } catch (err) {
            setError("Erro de conexão.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-[#1A202C] min-h-screen text-white p-4 sm:p-8">
            <div className="max-w-2xl mx-auto">
                <header className="mb-8">
                     <Link href={`/tournaments/${tournamentId}`} className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4">
                        <FaArrowLeft /> Voltar para o Torneio
                    </Link>
                    <h1 className="text-5xl font-extrabold text-[#E84F7F]">Adicionar Nova Equipe</h1>
                </header>
                
                <form onSubmit={handleSubmit} className="p-8 rounded-xl space-y-6" style={{ backgroundColor: '#2D3748' }}>
                    {error && <p className="text-red-300 bg-red-500/20 p-3 rounded-lg">{error}</p>}
                    
                    <div>
                        <label htmlFor="name" className="block text-sm font-semibold mb-2 text-gray-300">Nome da Equipe</label>
                        <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full p-3 rounded-lg bg-[#4A5568] border border-transparent focus:outline-none focus:ring-2 focus:ring-[#8A2BE2]" />
                    </div>

                    <button type="submit" disabled={isSubmitting} className="w-full flex justify-center items-center gap-2 font-bold py-3 px-4 rounded-lg text-lg text-white bg-[#4CAF50] hover:bg-green-600 disabled:opacity-50">
                        {isSubmitting ? <><FaSpinner className="animate-spin" /> Adicionando...</> : <><FaPlus /> Adicionar Equipe</>}
                    </button>
                </form>
            </div>
        </div>
    );
}