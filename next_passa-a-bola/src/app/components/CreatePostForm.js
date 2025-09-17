'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { FaImage, FaPaperPlane, FaSpinner, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext'; // Para pegar a imagem do usuário
import API_URL, { apiPath } from '@/config/api';

export default function CreatePostForm({ onPostCreated }) {
    const { user } = useAuth(); // Supondo que o contexto forneça o objeto do usuário com a imagem
    const [content, setContent] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Ref para o input de arquivo, para podermos limpá-lo programaticamente
    const fileInputRef = useRef(null);

    // Cores da Paleta
    const primaryPink = '#E84F7F';
    const primaryPurple = '#8A2BE2';
    const cardBg = '#2D3748';
    const inputBg = '#4A5568';
    const mutedColor = '#718096';

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Reseta o valor do input
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim() && !imageFile) return; // Não permite post vazio

        setIsSubmitting(true);
        const token = localStorage.getItem('accessToken');

        const formData = new FormData();
        formData.append('content', content);
        if (imageFile) {
            formData.append('file', imageFile);
        }

        try {
            const res = await fetch(apiPath('/api/feed/posts'), {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData,
            });

            if (res.ok) {
                setContent('');
                removeImage();
                onPostCreated(); // Atualiza o feed na página pai
            } else {
                // Idealmente, tratar o erro de forma mais elegante
                alert('Erro ao criar a postagem.');
            }
        } catch (error) {
            console.error("Falha na requisição:", error);
            alert('Erro de conexão ao criar a postagem.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form 
            onSubmit={handleSubmit} 
            className="p-5 rounded-xl shadow-lg mb-8 border-l-4"
            style={{ backgroundColor: cardBg, borderColor: primaryPink }}
        >
            <div className="flex items-start gap-4">
                {/* Avatar do Usuário */}
                <div className="flex-shrink-0">
                    <Image 
                        src={user?.image_url || '/default-avatar.png'} 
                        alt="Seu avatar" 
                        width={48} 
                        height={48} 
                        className="rounded-full object-cover"
                    />
                </div>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="No que você está pensando, craque?"
                    required={!imageFile} // O texto só é obrigatório se não houver imagem
                    className="w-full bg-transparent p-2 text-lg text-white placeholder-gray-400 focus:outline-none resize-none"
                    rows="3"
                />
            </div>

            {/* Preview da Imagem Selecionada */}
            {imagePreview && (
                <div className="mt-4 pl-16 relative">
                    <Image src={imagePreview} alt="Preview da imagem" width={500} height={300} className="rounded-lg object-contain max-h-80 w-auto" />
                    <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-black bg-opacity-60 text-white rounded-full p-1.5 hover:bg-opacity-80 transition-opacity"
                        aria-label="Remover imagem"
                    >
                        <FaTimes />
                    </button>
                </div>
            )}
            
            <div className="flex justify-between items-center mt-4 pl-16">
                {/* Botão Customizado para Upload de Imagem */}
                <label 
                    htmlFor="file-upload" 
                    className="flex items-center gap-2 cursor-pointer p-2 rounded-lg transition-colors"
                    style={{ color: mutedColor }}
                >
                    <FaImage size={20} style={{ color: primaryPink }}/>
                    <span className="font-semibold text-white">Adicionar Foto</span>
                </label>
                <input 
                    id="file-upload"
                    ref={fileInputRef}
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    className="hidden" // O input real fica escondido
                />
                
                <button 
                    type="submit" 
                    disabled={isSubmitting || (!content.trim() && !imageFile)}
                    className="flex items-center gap-2 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: isSubmitting ? mutedColor : primaryPurple }}
                >
                    {isSubmitting ? (
                        <>
                            <FaSpinner className="animate-spin" />
                            <span>Publicando...</span>
                        </>
                    ) : (
                        <>
                            <FaPaperPlane />
                            <span>Publicar</span>
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}