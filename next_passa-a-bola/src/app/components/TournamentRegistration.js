// app/components/TournamentRegistration.js
'use client';

import { useAuth } from '../context/AuthContext'; // Importe seu hook de autenticação

// Este é um Client Component que lida com toda a interatividade
export default function TournamentRegistration({ tournament, teams }) {
    const { user } = useAuth(); // Pega o usuário logado do contexto

    // Se não houver usuário logado, não mostra nada
    if (!user) {
        return null;
    }

    const allTeamsFull = teams.every(team => team.player_ids.length >= tournament.max_players_per_team);

    // Funções para lidar com os cliques (a lógica da API iria aqui)
    const handleJoinTeam = (teamId) => {
        alert(`Lógica para entrar no time ${teamId}`);
    };
    const handleCreateTeam = () => {
        alert('Lógica para criar um novo time');
    };
    const handleJoinQueue = () => {
        alert('Lógica para entrar na fila de espera');
    };

    return (
        <div className="mt-8 bg-gray-800 p-6 rounded-lg">
            <h3 className="text-3xl font-bold mb-4">Inscrições Abertas</h3>
            {teams.map(team => (
                <div key={team._id} className="bg-gray-700 p-4 rounded mb-3 flex justify-between items-center">
                    <div>
                        <h4 className="font-bold text-lg">{team.name}</h4>
                        <span>({team.player_ids.length}/{tournament.max_players_per_team} jogadoras)</span>
                    </div>
                    {team.player_ids.length < tournament.max_players_per_team ? (
                        <button onClick={() => handleJoinTeam(team._id)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                            Entrar no Time
                        </button>
                    ) : (
                        <p className="text-red-400 font-semibold">Time Cheio</p>
                    )}
                </div>
            ))}

            <div className="mt-6">
                {allTeamsFull ? (
                    <button onClick={handleJoinQueue} className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-2 px-4 rounded">
                        Entrar na Fila de Espera
                    </button>
                ) : (
                    <button onClick={handleCreateTeam} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Criar meu Time
                    </button>
                )}
            </div>
        </div>
    );
}