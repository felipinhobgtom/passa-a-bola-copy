'use client';

import { useState } from 'react';
import { FaClipboardList, FaUsers, FaPenSquare } from 'react-icons/fa';
// Supondo que você tenha estes componentes já criados e estilizados
import MatchCard from './MatchCard'; 
import TournamentRegistration from './TournamentRegistration';
import TeamCard from './TeamCard'; // Um novo componente para exibir equipes

const TabButton = ({ label, icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-3 px-6 py-3 font-bold text-lg rounded-t-lg border-b-4 transition-colors ${
            isActive 
                ? 'text-white border-[#E84F7F]' 
                : 'text-gray-400 border-transparent hover:text-white hover:border-gray-500'
        }`}
    >
        {icon} {label}
    </button>
);

export default function TournamentTabs({ tournament, matches, teams }) {
    const [activeTab, setActiveTab] = useState('matches');

    return (
        <div>
            {/* Navegação por Abas */}
            <div className="border-b border-gray-700 mb-8">
                <nav className="flex space-x-4">
                    <TabButton label="Jogos" icon={<FaClipboardList />} isActive={activeTab === 'matches'} onClick={() => setActiveTab('matches')} />
                    <TabButton label="Equipes" icon={<FaUsers />} isActive={activeTab === 'teams'} onClick={() => setActiveTab('teams')} />
                    {tournament.registration_open && (
                        <TabButton label="Inscrição" icon={<FaPenSquare />} isActive={activeTab === 'registration'} onClick={() => setActiveTab('registration')} />
                    )}
                </nav>
            </div>

            {/* Conteúdo da Aba Ativa */}
            <div>
                {activeTab === 'matches' && (
                    <div className="space-y-4">
                        {matches.length > 0 ? (
                            matches.map(match => <MatchCard key={match._id} match={match} />)
                        ) : (
                            <div className="bg-[#2D3748] text-center p-8 rounded-lg">
                                <p className="text-gray-400">Nenhum jogo agendado para este torneio ainda.</p>
                            </div>
                        )}
                    </div>
                )}
                {activeTab === 'teams' && (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {teams.length > 0 ? (
                            teams.map(team => <TeamCard key={team._id} team={team} />)
                        ) : (
                            <div className="bg-[#2D3748] text-center p-8 rounded-lg md:col-span-2">
                                <p className="text-gray-400">Nenhuma equipe inscrita neste torneio ainda.</p>
                            </div>
                        )}
                    </div>
                )}
                {activeTab === 'registration' && tournament.registration_open && (
                    <TournamentRegistration tournament={tournament} teams={teams} />
                )}
            </div>
        </div>
    );
}