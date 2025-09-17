"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { FaSpinner, FaUsers, FaCalendarAlt, FaPlus, FaArrowLeft } from 'react-icons/fa';
import API_URL from '@/config/api';

// Componente reutilizável para a lista de seleção de jogadoras
const PlayerSelectList = ({ players, selectedPlayers, onSelectionChange }) => {
    const handlePlayerSelect = (playerId) => {
        if (selectedPlayers.includes(playerId)) {
            onSelectionChange(selectedPlayers.filter(id => id !== playerId));
        } else {
            onSelectionChange([...selectedPlayers, playerId]);
        }
    };

    return (
        <div 
            className="w-full h-64 p-3 rounded-lg overflow-y-auto space-y-2"
            style={{ backgroundColor: '#4A5568' }}
        >
            {players.map((player) => (
                <label key={player._id} className="flex items-center gap-3 p-2 rounded-md transition-colors hover:bg-gray-600 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={selectedPlayers.includes(player._id)}
                        onChange={() => handlePlayerSelect(player._id)}
                        className="h-5 w-5 rounded text-[#E84F7F] bg-gray-700 border-gray-500 focus:ring-2 focus:ring-[#E84F7F]"
                    />
                    <span className="font-medium text-white">{player.name}</span>
                </label>
            ))}
        </div>
    );
};

export default function AddMatchPage() {
    const router = useRouter();
    const params = useParams();
    const tournamentId = params.id;

    const [teamAName, setTeamAName] = useState("");
    const [teamBName, setTeamBName] = useState("");
    const [matchDate, setMatchDate] = useState("");
    const [lineupA, setLineupA] = useState([]);
    const [lineupB, setLineupB] = useState([]);
    
    const [allPlayers, setAllPlayers] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false); // NOVO ESTADO

    const primaryPink = '#E84F7F';
    const primaryPurple = '#8A2BE2';
    const primaryGreen = '#4CAF50';
    const cardBg = '#2D3748';
    const inputBg = '#4A5568';

    useEffect(() => {
        async function fetchPlayers() {
            try {
                const res = await fetch(`${API_URL}/api/players`);
                if (!res.ok) throw new Error("Failed to fetch players");
                const data = await res.json();
                setAllPlayers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchPlayers();
    }, []); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!matchDate) {
            setError("Por favor, selecione uma data e hora para o jogo.");
            return;
        }

        setIsSubmitting(true); // Ativa o estado de submissão
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setError("Autenticação falhou. Por favor, faça o login novamente.");
            setIsSubmitting(false);
            return;
        }

        const matchData = {
            tournament_id: tournamentId,
            team_a_name: teamAName,
            team_b_name: teamBName,
            match_date: new Date(matchDate).toISOString(),
            lineup_a: lineupA,
            lineup_b: lineupB,
        };

        try {
            const res = await fetch(`${API_URL}/api/matches/`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(matchData),
            });

            if (res.ok) {
                router.push(`/tournaments/${tournamentId}`);
                router.refresh();
            } else {
                const data = await res.json();
                setError(data.detail || "Falha ao criar o jogo.");
            }
        } catch (err) {
            setError("Erro de conexão. Tente novamente mais tarde.");
        } finally {
            setIsSubmitting(false); // Desativa o estado de submissão
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-[#1A202C] text-white">
                <FaSpinner className="animate-spin text-5xl" style={{ color: primaryPink }} />
                <p className="mt-4 text-lg">A carregar lista de jogadoras...</p>
            </div>
        );
    }

    return (
        <div className="bg-[#1A202C] min-h-screen text-white p-4 sm:p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <Link href={`/tournaments/${tournamentId}`} className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4">
                        <FaArrowLeft /> Voltar para o Torneio
                    </Link>
                    <h1 className="text-5xl font-extrabold" style={{ color: primaryPink }}>Agendar Novo Jogo</h1>
                    <p className="text-gray-400 mt-2">Preencha os detalhes da partida e selecione as jogadoras para cada equipe.</p>
                </header>
                
                <form onSubmit={handleSubmit} className="p-8 rounded-xl space-y-8" style={{ backgroundColor: cardBg }}>
                    {error && (
                        <p className="text-red-300 bg-red-500/20 border border-red-500 p-3 rounded-lg font-semibold">{error}</p>
                    )}

                    <fieldset>
                        <legend className="text-2xl font-bold mb-4 flex items-center gap-3" style={{ color: primaryPurple }}><FaUsers /> Informações das Equipes</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="teamA" className="block text-sm font-semibold mb-2 text-gray-300">Nome da Equipe A</label>
                                <input id="teamA" type="text" value={teamAName} onChange={(e) => setTeamAName(e.target.value)} required className={`w-full p-3 rounded-lg bg-[${inputBg}] border border-transparent focus:outline-none focus:ring-2 focus:ring-[${primaryPurple}]`} />
                            </div>
                            <div>
                                <label htmlFor="teamB" className="block text-sm font-semibold mb-2 text-gray-300">Nome da Equipe B</label>
                                <input id="teamB" type="text" value={teamBName} onChange={(e) => setTeamBName(e.target.value)} required className={`w-full p-3 rounded-lg bg-[${inputBg}] border border-transparent focus:outline-none focus:ring-2 focus:ring-[${primaryPurple}]`} />
                            </div>
                        </div>
                    </fieldset>

                     <fieldset>
                        <legend className="text-2xl font-bold mb-4 flex items-center gap-3" style={{ color: primaryPurple }}><FaCalendarAlt /> Data e Hora</legend>
                        <div>
                            <label htmlFor="matchDate" className="block text-sm font-semibold mb-2 text-gray-300">Data e Hora do Jogo</label>
                            <input id="matchDate" type="datetime-local" value={matchDate} onChange={(e) => setMatchDate(e.target.value)} required className={`w-full p-3 rounded-lg bg-[${inputBg}] border border-transparent focus:outline-none focus:ring-2 focus:ring-[${primaryPurple}]`} />
                        </div>
                    </fieldset>

                    <fieldset>
                        <legend className="text-2xl font-bold mb-4" style={{ color: primaryPurple }}>Escalação</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-lg font-semibold mb-2 text-gray-300">Equipe A</label>
                                <PlayerSelectList players={allPlayers} selectedPlayers={lineupA} onSelectionChange={setLineupA} />
                            </div>
                            <div>
                                <label className="block text-lg font-semibold mb-2 text-gray-300">Equipe B</label>
                                <PlayerSelectList players={allPlayers} selectedPlayers={lineupB} onSelectionChange={setLineupB} />
                            </div>
                        </div>
                    </fieldset>

                    <button type="submit" disabled={isSubmitting} className="w-full flex justify-center items-center gap-2 font-bold py-3 px-4 rounded-lg text-lg text-white transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed" style={{ backgroundColor: primaryGreen }}>
                        {isSubmitting ? (
                            <><FaSpinner className="animate-spin" /> Adicionando...</>
                        ) : (
                            <><FaPlus /> Adicionar Jogo</>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}