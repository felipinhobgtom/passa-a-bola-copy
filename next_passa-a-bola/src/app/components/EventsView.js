'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import EventsMapWrapper from './EventsMapWrapper';
import { FaMapMarkerAlt, FaCalendarAlt, FaFutbol } from 'react-icons/fa';

export default function EventsView({ events }) {
    const [userRole, setUserRole] = useState(null);
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [activeTab, setActiveTab] = useState('map');

    useEffect(() => {
        const role = localStorage.getItem('userRole');
        setUserRole(role);
    }, []);

    const handleEventClick = (event) => {
        setSelectedPosition([event.location.latitude, event.location.longitude]);
        setActiveTab('map'); // Switch to map view when clicking an event
    };

    return (
        <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-green-500 bg-clip-text text-transparent">
                        Eventos do Futebol Feminino
                    </h1>
                    <p className="text-gray-400 mt-2">Descubra eventos e campeonatos perto de você</p>
                </div>
                {userRole === 'admin' && (
                    <Link 
                        href="/events/create" 
                        className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-full transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg"
                    >
                        <FaFutbol className="text-xl" /> Criar Novo Evento
                    </Link>
                )}
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-500/20">
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setActiveTab('map')}
                        className={activeTab === 'map'
                            ? "flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white transition-all"
                            : "flex items-center gap-2 px-4 py-2 rounded-full text-gray-400 hover:text-white transition-all"}
                    >
                        <FaMapMarkerAlt /> Mapa
                    </button>
                    <button
                        onClick={() => setActiveTab('list')}
                        className={activeTab === 'list'
                            ? "flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-green-500 text-white transition-all"
                            : "flex items-center gap-2 px-4 py-2 rounded-full text-gray-400 hover:text-white transition-all"}
                    >
                        <FaCalendarAlt /> Lista
                    </button>
                </div>

                <div className={activeTab === 'map' ? 'block' : 'hidden'}>
                    <div className="rounded-xl overflow-hidden border border-purple-500/20 shadow-lg">
                        <EventsMapWrapper events={events} selectedPosition={selectedPosition} />
                    </div>
                </div>

                <div className={activeTab === 'list' ? 'block' : 'hidden'}>
                    <h2 className="text-2xl font-bold mb-4 text-white">Próximos Eventos:</h2>
                    <div className="events-list">
                        {events && events.length > 0 ? (
                            <ul className="space-y-3">
                                {events.map(event => {
                                const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${event.location.latitude},${event.location.longitude}`;

                                return (
                                    <li 
                                        key={event._id} 
                                        className="bg-gray-700/50 p-4 rounded-xl flex justify-between items-center hover:bg-gray-700/70 transition-all border border-purple-500/10"
                                    >
                                        <div 
                                            className="cursor-pointer flex-grow"
                                            onClick={() => handleEventClick(event)}
                                        >
                                            <div className="flex items-center gap-2">
                                                <FaFutbol className="text-pink-500" />
                                                <strong className="text-white">{event.eventName}</strong>
                                            </div>
                                            <div className="text-gray-400 mt-1 flex items-center gap-2">
                                                <FaCalendarAlt className="text-purple-400" />
                                                {new Date(event.date).toLocaleDateString('pt-BR')}
                                            </div>
                                        </div>

                                        <a 
                                            href={mapsUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="ml-4 text-sm bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2 px-4 rounded-full transition-all flex items-center gap-2 hover:scale-105"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <FaMapMarkerAlt />
                                            Como Chegar
                                        </a>
                                    </li>
                                );
                            })}
                            </ul>
                        ) : (
                            <p className="text-gray-400 text-center">Nenhum evento encontrado.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}