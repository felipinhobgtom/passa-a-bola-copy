'use client';
import API_URL, { apiPath } from '@/config/api';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateEventPage() {
    const router = useRouter();
    const [eventName, setEventName] = useState('');
    const [date, setDate] = useState('');
    const [address, setAddress] = useState(''); // <-- NOVO CAMPO
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    // app/events/create/page.js

const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 1. Pegar o token de acesso do localStorage
    const token = localStorage.getItem('accessToken');

    if (!token) {
        setError("Autenticação necessária. Por favor, faça o login novamente.");
        return;
    }

    const eventData = {
        eventName,
        date: new Date(date).toISOString(),
        address, // O backend irá geocodificar este endereço
        description
    };

    const res = await fetch(apiPath('/api/events/'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // 2. Adicionar o cabeçalho de Autorização com o token
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(eventData)
    });

    if (res.ok) {
        router.push('/events');
        router.refresh();
    } else if (res.status === 401 || res.status === 403) {
        // Se o erro for de autorização, exibe uma mensagem clara
        setError("Você não tem permissão para realizar esta ação.");
    } else {
        const data = await res.json();
        setError(data.detail || "Falha ao criar o evento.");
    }
};

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Criar Novo Evento</h1>
            <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg space-y-6">
                {error && <p className="text-red-400 bg-red-900 p-3 rounded">{error}</p>}
                
                <div>
                    <label htmlFor="eventName" className="block mb-2 text-sm font-medium">Nome do Evento</label>
                    <input id="eventName" type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} required className="w-full p-2 rounded bg-gray-700 border border-gray-600"/>
                </div>

                <div>
                    <label htmlFor="address" className="block mb-2 text-sm font-medium">Endereço Completo</label>
                    <input id="address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Ex: Av. Paulista, 1578, São Paulo, SP" required className="w-full p-2 rounded bg-gray-700 border border-gray-600"/>
                </div>
                
                <div>
                    <label htmlFor="date" className="block mb-2 text-sm font-medium">Data e Hora</label>
                    <input id="date" type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full p-2 rounded bg-gray-700 border border-gray-600"/>
                </div>

                <div>
                    <label htmlFor="description" className="block mb-2 text-sm font-medium">Descrição</label>
                    <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 rounded bg-gray-700 border border-gray-600"/>
                </div>

                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded">Criar Evento</button>
            </form>
        </div>
    );
}