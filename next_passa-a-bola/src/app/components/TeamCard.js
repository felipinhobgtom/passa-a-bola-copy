'use client';

import Image from 'next/image';
import { FaUser } from 'react-icons/fa';

export default function TeamCard({ team }) {
    const cardBg = '#2D3748';
    const primaryPink = '#E84F7F';

    return (
        <div 
            className="rounded-xl p-6 shadow-lg"
            style={{ backgroundColor: cardBg }}
        >
            <div className="flex items-center gap-4 mb-4">
                <div className="relative w-16 h-16">
                    {/* Placeholder para o logo da equipe */}
                    <Image 
                        src={team.logo_url || '/default-team-logo.png'} 
                        alt={`Logo da equipe ${team.name}`}
                        fill
                        className="rounded-full object-cover border-2"
                        style={{ borderColor: primaryPink }}
                    />
                </div>
                <h3 className="text-2xl font-bold text-white">{team.name || 'Nome da Equipe'}</h3>
            </div>
            
            <div>
                <h4 className="font-semibold text-lg mb-2" style={{ color: primaryPink }}>Jogadoras</h4>
                <ul className="space-y-2">
                    {team.players && team.players.length > 0 ? (
                        team.players.map(player => (
                            <li key={player.id} className="flex items-center gap-2 text-gray-300">
                                <FaUser />
                                <span>{player.name}</span>
                            </li>
                        ))
                    ) : (
                        <p className="text-sm text-gray-400">Nenhuma jogadora na equipe ainda.</p>
                    )}
                </ul>
            </div>
        </div>
    );
}