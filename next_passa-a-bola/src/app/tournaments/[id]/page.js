import API_URL from '@/config/api';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FaCalendarAlt, FaMapMarkerAlt, FaPlus, FaTrash, FaUsers } from 'react-icons/fa';
import TournamentTabs from '../../components/TournamentTabs';
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';

// --- FUNÇÕES DE BUSCA DE DADOS ---
async function getTournamentDetails(id) {
    try {
    const res = await fetch(`${API_URL}/api/tournaments/${id}`, { cache: 'no-store' });
        if (!res.ok) {
            if (res.status === 404) notFound();
            throw new Error('Falha ao buscar os detalhes do torneio');
        }
        return res.json();
    } catch (error) {
        console.error("Erro de rede ao buscar detalhes do torneio:", error);
        notFound();
    }
}

async function getTournamentMatches(id) {
    try {
    const res = await fetch(`${API_URL}/api/matches/?tournament_id=${id}`, { cache: 'no-store' });
        if (!res.ok) return [];
        return res.json();
    } catch (error) {
        console.error("Erro de rede ao buscar jogos do torneio:", error);
        return [];
    }
}

async function getTournamentTeams(id) {
    try {
    const res = await fetch(`${API_URL}/api/tournaments/${id}/teams`, { cache: 'no-store' });
        if (!res.ok) return [];
        return res.json();
    } catch (error) {
        console.error("Erro de rede ao buscar equipes do torneio:", error);
        return [];
    }
}

// **CORREÇÃO 1: TRANSFORMAR A FUNÇÃO EM ASYNC**
async function getUserRole() {
    const tokenCookie = cookies().get('accessToken');
    if (!tokenCookie) return null;

    const token = tokenCookie.value;
    try {
        const decoded = jwtDecode(token);
        return decoded.role;
    } catch (e) {
        return null;
    }
}

export default async function TournamentDetailPage({ params }) {
    // Explicitly get the ID from params at the top.
    const { id } = params;

    const userRole = await getUserRole();
    const isAdmin = userRole === 'admin';
    
    // Use the `id` variable consistently.
    const [tournament, matches, teams] = await Promise.all([
        getTournamentDetails(id),
        getTournamentMatches(id),
        getTournamentTeams(id)
    ]);

    if (!tournament) {
        notFound();
    }
    
    const primaryPink = '#E84F7F';

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('pt-BR', { dateStyle: 'long' });

    return (
        <div className="bg-[#1A202C] min-h-screen text-white">
            {/* Banner Header */}
            <header 
                className="relative py-20 px-8 text-center bg-cover bg-center"
                style={{ backgroundImage: "url('/stadium-banner.jpg')" }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A202C] via-[#1A202C]/80 to-black/60"></div>
                <div className="relative z-10">
                    <h1 className="text-5xl md:text-7xl font-extrabold">{tournament.name}</h1>
                    <p className="text-xl text-gray-300 mt-4 max-w-3xl mx-auto">{tournament.description}</p>
                    <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 mt-6 text-lg">
                        <div className="flex items-center gap-2">
                            <FaCalendarAlt style={{ color: primaryPink }}/>
                            <span>{formatDate(tournament.start_date)} até {formatDate(tournament.end_date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaMapMarkerAlt style={{ color: primaryPink }}/>
                            <span>{tournament.location}</span>
                        </div>
                    </div>
                </div>
            </header>
            
            <main className="container mx-auto p-8">
                {/* Ações do Admin */}
                
                     <div className="flex justify-end gap-4 mb-8 -mt-4">
                        {/* LINK PARA ADICIONAR EQUIPE */}
                        <Link href={`/tournaments/${params.id}/add-team`} className="inline-flex items-center gap-2 bg-[#8A2BE2] text-white font-bold py-2 px-4 rounded transition-colors hover:bg-purple-600">
                            <FaUsers /> Adicionar Equipe
                        </Link>
                        <Link href={`/tournaments/${params.id}/add-match`} className="inline-flex items-center gap-2 bg-[#4CAF50] text-white font-bold py-2 px-4 rounded transition-colors hover:bg-green-600">
                            <FaPlus /> Adicionar Jogo
                        </Link>
                         <button className="inline-flex items-center gap-2 bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors hover:bg-red-700">
                            <FaTrash /> Excluir Torneio
                         </button>
                    </div>
                

                {/* Componente de Abas Interativas */}
                <TournamentTabs tournament={tournament} matches={matches} teams={teams} />
            </main>
        </div>
    );
}