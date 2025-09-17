'use client';
import API_URL from '@/config/api';
// app/olheiro/dashboard/page.js

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ScoutDashboard() {
    const { userRole } = useAuth();
    const router = useRouter();
    const [players, setPlayers] = useState([]);
    const [filters, setFilters] = useState({ position: '', maxAge: '' });

    // Proteção da Rota: se não for olheiro, redireciona
    useEffect(() => {
        if (userRole && userRole !== 'olheiro') {
            router.push('/dashboard');
        }
    }, [userRole, router]);

    const handleSearch = async () => {
        const token = localStorage.getItem('accessToken');
        const params = new URLSearchParams(filters).toString();
        // Nota: Você precisará criar a rota GET /api/players/search no backend
        const res = await fetch(`${API_URL}/api/players/search?${params}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            const data = await res.json();
            setPlayers(data);
        }
    };

    return (
        <div>
            <h1 className="text-4xl font-bold mb-6">Dashboard de Olheiro</h1>
            {/* Formulário de Filtros */}
            <div className="bg-gray-800 p-6 rounded-lg mb-8 flex gap-4">
                <input type="text" value={filters.position} onChange={(e) => setFilters({...filters, position: e.target.value})} placeholder="Posição" className="p-2 rounded bg-gray-700"/>
                <input type="number" value={filters.maxAge} onChange={(e) => setFilters({...filters, maxAge: e.target.value})} placeholder="Idade Máxima" className="p-2 rounded bg-gray-700"/>
                <button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Buscar</button>
            </div>
            {/* Resultados */}
            <div>
                <h2 className="text-2xl font-bold mb-4">Resultados da Busca</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {players.map(player => (
                        <div key={player.id} className="bg-gray-700 p-4 rounded">
                            <h3 className="font-bold">{player.full_name}</h3>
                            <p>{player.position}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}