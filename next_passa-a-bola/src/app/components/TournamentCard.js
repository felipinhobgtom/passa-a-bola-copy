// src/app/components/TournamentCard.js

'use client';

import Link from 'next/link';
import { FaCalendarAlt, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';

export default function TournamentCard({ tournament }) {
    const primaryPink = '#E84F7F';
    const primaryPurple = '#8A2BE2';
    const cardBg = '#2D3748';
    
    const formatDate = (dateString) => {
        if (!dateString) return 'Data indefinida';
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short'
        });
    };

    return (
        <div 
            className="flex flex-col rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/10 border-t-4"
            style={{ backgroundColor: cardBg, borderColor: primaryPurple }}
        >
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-white mb-4 flex-grow">
                    {tournament.name}
                </h3>
                
                <div className="space-y-3 text-gray-300 mb-6">
                    <div className="flex items-center gap-3">
                        <FaCalendarAlt className="text-gray-400" />
                        <span>{formatDate(tournament.start_date)} - {formatDate(tournament.end_date)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <FaMapMarkerAlt className="text-gray-400" />
                        <span>{tournament.location}</span>
                    </div>
                </div>

                <p className="text-gray-400 text-base mb-6 line-clamp-3">
                    {tournament.description}
                </p>
                
                <div className="mt-auto">
                    {/* **CORRECTION APPLIED HERE** */}
                    <Link 
                        href={`/tournaments/${tournament._id}`} // Ensures the tournament ID is passed in the URL
                        className="inline-flex items-center gap-2 font-bold py-2 px-5 rounded-lg text-white transition-transform transform hover:scale-105"
                        style={{ backgroundColor: primaryPink }}
                    >
                        Ver Detalhes <FaArrowRight />
                    </Link>
                </div>
            </div>
        </div>
    );
}