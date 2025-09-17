'use client';
import API_URL from '@/config/api';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function EditProfilePage() {
    const { userRole } = useAuth();
    const router = useRouter();
    const [profile, setProfile] = useState({
        full_name: '',
        birth_date: '',
        position: '',
        bio: '',
        social_links: { instagram: '', twitter: '' }
    });
    const [pfpFile, setPfpFile] = useState(null); // Para a foto de perfil
    const [mediaFile, setMediaFile] = useState(null); // Para a galeria
    
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (userRole && userRole !== 'jogadora_amadora' && userRole !== 'jogadora_profissional') {
            router.push('/dashboard');
            return;
        }

        const token = localStorage.getItem('accessToken');
        if (!token) {
            router.push('/login');
            return;
        }

        async function fetchProfile() {
            const res = await fetch(`${API_URL}/api/profiles/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (res.status === 404) {
                setLoading(false);
                return;
            }

            if (res.ok) {
                const data = await res.json();
                if (data) {
                    data.birth_date = data.birth_date ? new Date(data.birth_date).toISOString().split('T')[0] : '';
                    setProfile(prev => ({ ...prev, ...data }));
                }
            }
            setLoading(false);
        }
        fetchProfile();
    }, [userRole, router]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'instagram' || name === 'twitter') {
            setProfile(prev => ({ ...prev, social_links: { ...prev.social_links, [name]: value } }));
        } else {
            setProfile(prev => ({ ...prev, [name]: value }));
        }
    };

    const handlePfpFileChange = (e) => {
        setPfpFile(e.target.files[0]);
    };

    const handleMediaFileChange = (e) => {
        setMediaFile(e.target.files[0]);
    };

    
    // A função handleSubmit correta e única
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        const token = localStorage.getItem('accessToken');
        if (!token) {
            setMessage("Você não está autenticado.");
            return;
        }

        const profileDataToSend = { ...profile };
        if (!profileDataToSend.birth_date) {
            delete profileDataToSend.birth_date;
        }
        delete profileDataToSend.id;
        delete profileDataToSend.user_id;

        const res = await fetch(`${API_URL}/api/profiles/me`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(profileDataToSend),
        });

        if (res.ok) {
            setMessage('Perfil atualizado com sucesso!');
        } else {
            const data = await res.json();
            setMessage(`Erro ao atualizar o perfil: ${JSON.stringify(data.detail)}`);
        }
    };
    
    const handleProfilePictureUpload = async () => {
        if (!pfpFile) return;
        setIsUploading(true);
        setMessage('');
        const token = localStorage.getItem('accessToken');
        const formData = new FormData();
        formData.append('file', pfpFile);

        const res = await fetch(`${API_URL}/api/profiles/me/profile-picture`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData,
        });

        if (res.ok) {
            const updatedProfile = await res.json();
            setProfile(prev => ({ ...prev, image_url: updatedProfile.image_url }));
            setMessage('Foto de perfil atualizada com sucesso!');
        } else {
            setMessage('Erro ao enviar a foto de perfil.');
        }
        setIsUploading(false);
    };

    const handleMediaUpload = async () => {
        if (!mediaFile) return;
        setIsUploading(true);
        setMessage('');
        const token = localStorage.getItem('accessToken');
        const formData = new FormData();
        formData.append('file', mediaFile);

        const res = await fetch(`${API_URL}/api/profiles/me/media`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData,
        });

        if(res.ok) {
            setMessage('Mídia enviada para a galeria com sucesso!');
        } else {
            setMessage('Erro ao enviar mídia para a galeria.');
        }
        setIsUploading(false);
    };
    
    if (loading) return <p className="text-center">Carregando perfil...</p>;
    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">Editar Perfil de Jogadora</h1>
            {message && <p className="bg-amber-800 text-white p-3 rounded mb-4 text-center">{message}</p>}

            {/* Seção para Foto de Perfil */}
            <div className="bg-gray-800 p-8 rounded-lg mb-8">
                <h2 className="text-2xl font-bold mb-4">Foto de Perfil</h2>
                {profile.image_url && (
                    <img src={profile.image_url} alt="Foto de Perfil" className="w-32 h-32 rounded-full object-cover mb-4" />
                )}
                <input type="file" accept="image/*" onChange={handlePfpFileChange} className="w-full p-2 rounded bg-gray-700 mb-4"/>
                <button onClick={handleProfilePictureUpload} disabled={isUploading} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded disabled:bg-gray-500">
                    {isUploading ? 'Enviando...' : 'Salvar Foto de Perfil'}
                </button>
            </div>

            {/* Formulário de Dados (continua igual) */}
            <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg space-y-6 mb-8">
                <input name="full_name" value={profile.full_name || ''} onChange={handleInputChange} placeholder="Nome Completo" className="w-full p-2 rounded bg-gray-700"/>
                <input name="birth_date" type="date" value={profile.birth_date || ''} onChange={handleInputChange} className="w-full p-2 rounded bg-gray-700"/>
                <input name="position" value={profile.position || ''} onChange={handleInputChange} placeholder="Posição (Ex: Atacante)" className="w-full p-2 rounded bg-gray-700"/>
                <textarea name="bio" value={profile.bio || ''} onChange={handleInputChange} placeholder="Sua biografia como jogadora" className="w-full p-2 rounded bg-gray-700 h-32"/>
                <input name="instagram" value={profile.social_links?.instagram || ''} onChange={handleInputChange} placeholder="Link do Instagram" className="w-full p-2 rounded bg-gray-700"/>
                <input name="twitter" value={profile.social_links?.twitter || ''} onChange={handleInputChange} placeholder="Link do Twitter" className="w-full p-2 rounded bg-gray-700"/>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded">Salvar Alterações</button>
            </form>

            {/* Seção para Mídia da Galeria */}
            <div className="bg-gray-800 p-8 rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Adicionar à Galeria (Fotos e Vídeos)</h2>
                <input type="file" accept="image/*,video/*" onChange={handleMediaFileChange} className="w-full p-2 rounded bg-gray-700 mb-4"/>
                <button onClick={handleMediaUpload} disabled={isUploading} className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-3 px-4 rounded disabled:bg-gray-500">
                    {isUploading ? 'Enviando...' : 'Enviar Mídia para Galeria'}
                </button>
            </div>
        </div>
    );
}