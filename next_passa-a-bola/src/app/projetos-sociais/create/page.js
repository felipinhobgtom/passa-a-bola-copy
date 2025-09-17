'use client';
import API_URL from '@/config/api';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateSocialProjectPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [organizer, setOrganizer] = useState('');
    const [location_address, setLocationAddress] = useState('');
    const [website_url, setWebsiteUrl] = useState('');
    const [donation_url, setDonationUrl] = useState('');
    const [image_url, setImageUrl] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const token = localStorage.getItem('accessToken');
        if (!token) {
            setError("Autenticação necessária. Faça o login.");
            return;
        }

        const projectData = {
            name,
            description,
            organizer,
            location_address,
            website_url: website_url || null,
            donation_url: donation_url || null,
            image_url: image_url || null,
        };

        const res = await fetch(`${API_URL}/api/social-projects/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(projectData)
        });

        if (res.ok) {
            router.push('/projetos-sociais');
            router.refresh();
        } else {
            const data = await res.json();
            setError(data.detail || "Falha ao criar o projeto.");
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Adicionar Novo Projeto Social</h1>
            <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg space-y-4">
                {error && <p className="text-red-400 bg-red-900 p-3 rounded">{error}</p>}
                
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full p-2 rounded bg-gray-700 border border-gray-600" placeholder="Nome do Projeto"/>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full p-2 rounded bg-gray-700 border border-gray-600" placeholder="Descrição do Projeto"/>
                <input type="text" value={organizer} onChange={(e) => setOrganizer(e.target.value)} required className="w-full p-2 rounded bg-gray-700 border border-gray-600" placeholder="Organizador(a)"/>
                <input type="text" value={location_address} onChange={(e) => setLocationAddress(e.target.value)} required className="w-full p-2 rounded bg-gray-700 border border-gray-600" placeholder="Endereço de Localização"/>
                <input type="url" value={website_url} onChange={(e) => setWebsiteUrl(e.target.value)} className="w-full p-2 rounded bg-gray-700 border border-gray-600" placeholder="URL do Website (opcional)"/>
                <input type="url" value={donation_url} onChange={(e) => setDonationUrl(e.target.value)} className="w-full p-2 rounded bg-gray-700 border border-gray-600" placeholder="URL para Doação (opcional)"/>
                <input type="url" value={image_url} onChange={(e) => setImageUrl(e.target.value)} className="w-full p-2 rounded bg-gray-700 border border-gray-600" placeholder="URL da Imagem (opcional)"/>

                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded">Adicionar Projeto</button>
            </form>
        </div>
    );
}