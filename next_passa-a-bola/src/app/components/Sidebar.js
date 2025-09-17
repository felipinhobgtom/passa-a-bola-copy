'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaUser, FaSearch, FaNewspaper, FaCalendarAlt, FaHandHoldingHeart, FaSpinner } from 'react-icons/fa';
import API_URL, { apiPath } from '../../config/api';

// Componente para um único item de widget, para evitar repetição
const WidgetItem = ({ href, children }) => (
    <li className="truncate hover:text-white transition-colors">
        <Link href={href}>{children}</Link>
    </li>
);

// Componente para exibir o estado de carregamento dentro de um widget
const WidgetLoading = () => (
    <div className="flex items-center justify-center text-gray-400">
        <FaSpinner className="animate-spin mr-2" />
        <span>Carregando...</span>
    </div>
);

export default function Sidebar() {
    const [events, setEvents] = useState([]);
    const [socialProjects, setSocialProjects] = useState([]);
    const [eventsLoading, setEventsLoading] = useState(true);
    const [projectsLoading, setProjectsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async (url, setData, setLoading) => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const res = await fetch(apiPath(url), {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    // Limita a exibição a 3 itens para não poluir a sidebar
                    setData(data.slice(0, 3));
                }
            } catch (error) {
                console.error(`Falha ao buscar dados de ${url}:`, error);
            } finally {
                setLoading(false);
            }
        };

        // Rota baseada nos seus arquivos: events.py e social_projects.py
        fetchData('/api/events/', setEvents, setEventsLoading);
        fetchData('/api/social-projects/', setSocialProjects, setProjectsLoading);
    }, []);

    return (
        <aside className="space-y-8">
            {/* Widget: Próximos Eventos */}
            <div className="bg-[#2D3748] p-5 rounded-xl border-t-4 border-[#8A2BE2]">
                <h3 className="font-bold text-xl flex items-center gap-2 mb-4">
                    <FaCalendarAlt /> Próximos Eventos
                </h3>
                {eventsLoading ? (
                    <WidgetLoading />
                ) : (
                    <ul className="space-y-3 text-gray-300">
                        {events.length > 0 ? (
                            events.map(event => (
                                <WidgetItem key={event._id} href={`/events/${event._id}`}>
                                    {event.eventName}
                                </WidgetItem>
                            ))
                        ) : (
                            <p className="text-sm text-gray-400">Nenhum evento próximo.</p>
                        )}
                    </ul>
                )}
            </div>

            {/* Widget: Navegação Rápida (Estático) */}
            <div className="bg-[#2D3748] p-5 rounded-xl border-t-4 border-[#4CAF50]">
                <h3 className="font-bold text-xl mb-4">Navegação</h3>
                <ul className="space-y-3">
                    <li><Link href="/perfil" className="flex items-center gap-3 hover:text-[#E84F7F] transition-colors"><FaUser /> Meu Perfil</Link></li>
                    <li><Link href="/players" className="flex items-center gap-3 hover:text-[#E84F7F] transition-colors"><FaSearch /> Procurar Jogadoras</Link></li>
                    <li><Link href="/noticias" className="flex items-center gap-3 hover:text-[#E84F7F] transition-colors"><FaNewspaper /> Notícias</Link></li>
                </ul>
            </div>

            {/* Widget: Projetos Sociais */}
            <div className="bg-[#2D3748] p-5 rounded-xl text-center bg-gradient-to-br from-[#E84F7F] to-[#8A2BE2]">
                <FaHandHoldingHeart className="mx-auto text-4xl mb-3" />
                <h3 className="font-bold text-xl mb-2">Apoie a Causa</h3>
                {projectsLoading ? (
                    <WidgetLoading />
                ) : (
                    <>
                        <p className="text-sm mb-4">
                            {/* Mostra o nome do primeiro projeto social como destaque */}
                            {socialProjects.length > 0
                                ? `Conheça o projeto "${socialProjects[0].name}" e outros!`
                                : "Conheça projetos que fortalecem o futebol feminino."}
                        </p>
                        <Link href="/projetos-sociais" className="bg-white text-[#1A202C] font-bold py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                            Saiba Mais
                        </Link>
                    </>
                )}
            </div>
        </aside>
    );
}