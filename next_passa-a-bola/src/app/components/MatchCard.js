// app/components/MatchCard.js
'use client';

import DeleteButton from './DeleteButton';

/**
 * Card para exibir as informações de um único jogo.
 * @param {object} props
 * @param {object} props.match - O objeto contendo os dados do jogo.
 */
export default function MatchCard({ match }) {
    // Formata a data para um formato mais legível (ex: 14/09/2025, 21:30)
    const matchDate = new Date(match.date).toLocaleDateString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    return (
        <div className="bg-gray-700 p-4 rounded-lg flex items-center justify-between shadow-md animate-fadeIn">
            <div>
                <div className="flex items-center gap-4">
                    <span className="font-bold text-lg text-white">{match.team_a_name}</span>
                    <span className="text-xl font-mono px-3 py-1 bg-gray-800 rounded text-white">{match.team_a_score} x {match.team_b_score}</span>
                    <span className="font-bold text-lg text-white">{match.team_b_name}</span>
                </div>
                <p className="text-sm text-gray-400 mt-2">{matchDate} - Status: <span className="font-semibold capitalize">{match.status}</span></p>
            </div>
            <DeleteButton endpoint={`matches/${match._id}`} />
        </div>
    );
}