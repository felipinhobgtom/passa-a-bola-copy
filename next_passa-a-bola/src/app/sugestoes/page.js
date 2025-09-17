'use client';
import API_URL from '@/config/api';
// app/sugestoes/page.js

import { useState, useEffect } from 'react';
import EventsMapWrapper from '../components/EventsMapWrapper'; // Reutilizaremos o wrapper do mapa
import { useAuth } from '../context/AuthContext'; // Para verificar se o usuário está logado

export default function SuggestionsPage() {
    const { isLoggedIn } = useAuth(); // Pega o estado de login do contexto
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Estados para o formulário de nova sugestão
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');

    // Função para buscar as sugestões da API
    const fetchSuggestions = async () => {
        try {
            const res = await fetch(`${API_URL}/api/suggestions/`, { cache: 'no-store' });
            if (!res.ok) throw new Error('Falha ao carregar as sugestões.');
            const data = await res.json();
            setSuggestions(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Busca as sugestões quando o componente carrega
    useEffect(() => {
        fetchSuggestions();
    }, []);

    // Função para lidar com o envio de uma nova sugestão
    const handleSuggestionSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setError('Você precisa estar logado para sugerir um local.');
            return;
        }

    const res = await fetch(`${API_URL}/api/suggestions/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ address, description }),
        });

        if (res.ok) {
            setAddress('');
            setDescription('');
            fetchSuggestions(); // Atualiza a lista após o sucesso
        } else {
            const data = await res.json();
            setError(data.detail || 'Erro ao criar sugestão.');
        }
    };

    // Função para confirmar interesse em uma sugestão
    const handleInterestClick = async (suggestionId) => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert('Você precisa estar logado para confirmar interesse.');
            return;
        }

    const res = await fetch(`${API_URL}/api/suggestions/${suggestionId}/interest`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (res.ok) {
            fetchSuggestions(); // Atualiza a lista para refletir o novo interesse
        } else {
            alert('Erro ao confirmar interesse.');
        }
    };

    if (isLoading) return <p className="text-center">Carregando sugestões...</p>;

    // Transforma os dados de sugestão para o formato que o mapa espera
    const mapEvents = suggestions.map(s => ({
        _id: s._id,
        eventName: s.address,
        date: s.created_at,
        location: { latitude: s.latitude, longitude: s.longitude }
    }));

    return (
        <div>
            <h1 className="text-4xl font-bold mb-6">Quero Jogar Aqui!</h1>
            <p className="text-gray-400 mb-8">Sugira um local para um futuro jogo ou demonstre interesse em locais sugeridos por outras jogadoras.</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Coluna do Formulário e Lista */}
                <div className="lg:col-span-1 space-y-6">
                    {isLoggedIn && (
                        <div className="bg-gray-800 p-6 rounded-lg">
                            <h2 className="text-2xl font-bold mb-4">Sugerir um Novo Local</h2>
                            <form onSubmit={handleSuggestionSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="address" className="block text-sm font-medium mb-1">Endereço</label>
                                    <input id="address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} required className="w-full p-2 rounded bg-gray-700 border border-gray-600" placeholder="Ex: Praça da Sé, São Paulo"/>
                                </div>
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium mb-1">Descrição (opcional)</label>
                                    <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 rounded bg-gray-700 border border-gray-600" placeholder="Ex: Quadra pública com boa iluminação"></textarea>
                                </div>
                                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Enviar Sugestão</button>
                            </form>
                        </div>
                    )}

                    <div className="bg-gray-800 p-6 rounded-lg">
                        <h2 className="text-2xl font-bold mb-4">Locais Sugeridos</h2>
                        <ul className="space-y-3 max-h-96 overflow-y-auto">
                            {suggestions.map(s => (
                                <li key={s._id} className="bg-gray-700 p-3 rounded">
                                    <p className="font-bold">{s.address}</p>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-sm text-amber-400">{s.interested_user_ids.length} jogadoras com interesse</span>
                                        <button onClick={() => handleInterestClick(s._id)} className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-1 px-3 rounded-full">Tenho Interesse</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Coluna do Mapa */}
                <div className="lg:col-span-2 h-[500px] lg:h-auto">
                    <EventsMapWrapper events={mapEvents} />
                </div>
            </div>
        </div>
    );
}