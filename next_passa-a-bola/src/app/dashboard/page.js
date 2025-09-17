// app/dashboard/page.js
import StatCard from '../components/StatCard'; // <-- IMPORTADO
import NavCard from '../components/NavCard';   // <-- IMPORTADO

// API URL configuration
import API_URL, { apiPath } from '@/config/api';

// --- Funções de busca de dados (permanecem as mesmas) ---
async function getStats() {
    try {
        const [playersRes, eventsRes] = await Promise.all([
            fetch(apiPath('/api/players'), { cache: 'no-store' }),
            fetch(apiPath('/api/events'), { cache: 'no-store' })
        ]);

        if (!playersRes.ok || !eventsRes.ok) {
            return { playerCount: 0, eventCount: 0 };
        }

        const players = await playersRes.json();
        const events = await eventsRes.json();

        return {
            playerCount: players.length,
            eventCount: events.length
        };
    } catch (error) {
        console.error("Failed to fetch stats:", error);
        return { playerCount: 0, eventCount: 0 };
    }
}

// --- Componente Principal do Dashboard (agora mais limpo) ---
export default async function DashboardPage() {
    const { playerCount, eventCount } = await getStats();

    return (
        <div className="animate-fadeIn">
            <h1 className="text-4xl font-bold mb-4">Bem-vindo ao Dashboard</h1>
            <p className="text-lg text-gray-400 mb-8">Gerencie e explore o universo do futebol feminino.</p>

            {/* Seção de Estatísticas usando o componente importado */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <StatCard title="Jogadoras Cadastradas" value={playerCount} />
                <StatCard title="Eventos Agendados" value={eventCount} />
                <StatCard title="Torneios Ativos" value="1" /> 
            </div>

            {/* Seção de Navegação Rápida usando o componente importado */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <NavCard 
                    href="/players" 
                    title="Procurar Jogadoras" 
                    description="Encontre e filtre jogadoras por posição, nacionalidade e mais." 
                />
                <NavCard 
                    href="/tournaments" 
                    title="Chaveamento de Torneios" 
                    description="Visualize as fases e resultados das competições atuais." 
                />
                <NavCard 
                    href="/events" 
                    title="Mapa de Eventos" 
                    description="Localize peneiras, jogos e outros eventos importantes no mapa." 
                />
            </div>
        </div>
    );
}