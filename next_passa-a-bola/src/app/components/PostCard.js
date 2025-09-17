'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Usar o Image do Next.js para otimização
import { FaHeart, FaRegHeart, FaRegCommentDots, FaShare, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import API_URL, { apiPath } from '@/config/api';

export default function PostCard({ post }) {
    const { userId, isLoggedIn } = useAuth(); 
    
    const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
    const [isLiked, setIsLiked] = useState(userId ? post.likes?.includes(userId) : false);

    // Estados para a seção de comentários
    const [comments, setComments] = useState([]);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [isLoadingComments, setIsLoadingComments] = useState(false);
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    const handleLike = async () => {
        if (!isLoggedIn) return; // Impede a ação se não estiver logado

        const originalIsLiked = isLiked;
        const originalLikeCount = likeCount;

        // Lógica otimista
        setIsLiked(!originalIsLiked);
        setLikeCount(originalIsLiked ? originalLikeCount - 1 : originalLikeCount + 1);

        try {
            const token = localStorage.getItem('accessToken');
            await fetch(apiPath(`/api/feed/posts/${post._id}/like`), {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            // A API confirma o estado, não precisamos fazer nada se der sucesso
        } catch (error) {
            console.error("Falha ao curtir o post:", error);
            // Reverte a UI em caso de erro
            setIsLiked(originalIsLiked);
            setLikeCount(originalLikeCount);
        }
    };

    const fetchComments = async () => {
        if (comments.length > 0) return; // Não busca novamente se já tiver carregado

        setIsLoadingComments(true);
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(apiPath(`/api/feed/posts/${post._id}/comments`), {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setComments(data);
            }
        } catch (error) {
            console.error("Falha ao buscar comentários:", error);
        } finally {
            setIsLoadingComments(false);
        }
    };

    const handleToggleComments = () => {
        const newShowState = !showComments;
        setShowComments(newShowState);
        if (newShowState) { // Se estiver abrindo a seção, busca os comentários
            fetchComments();
        }
    };
    
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setIsSubmittingComment(true);
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(apiPath(`/api/feed/posts/${post._id}/comments`), {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: newComment })
            });

            if (res.ok) {
                const createdComment = await res.json();
                setComments(prev => [...prev, createdComment]); // Adiciona o novo comentário à lista
                setNewComment(''); // Limpa o input
            }
        } catch (error) {
            console.error("Falha ao enviar comentário:", error);
        } finally {
            setIsSubmittingComment(false);
        }
    };
    
    // Cores e outras variáveis
    const primaryPink = '#E84F7F';
    const primaryPurple = '#8A2BE2';
    const cardBg = '#2D3748';
    const textColor = '#CBD5E0';
    const mutedColor = '#718096';
    const hasValidLink = post.author_user_id;

    return (
        <div 
            className="rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10"
            style={{ backgroundColor: cardBg }}
        >
            <div className="p-5">
                {/* Cabeçalho do Post */}
                <div className="flex items-center gap-4 mb-4">
                    {hasValidLink ? (
                        <Link href={`/perfil/${post.author_user_id}`}>
                            <div className="relative w-12 h-12 cursor-pointer">
                                <Image 
                                    src={post.author_image_url || '/default-avatar.png'} 
                                    alt={`Foto de ${post.author_name}`}
                                    fill
                                    className="rounded-full object-cover"
                                />
                            </div>
                        </Link>
                    ) : (
                        <div className="relative w-12 h-12">
                            <Image 
                                src={post.author_image_url || '/default-avatar.png'} 
                                alt={`Foto de ${post.author_name}`}
                                fill
                                className="rounded-full object-cover"
                            />
                        </div>
                    )}
                    <div>
                        {hasValidLink ? (
                            <Link href={`/perfil/${post.author_user_id}`} className="font-bold text-white hover:underline" style={{ textDecorationColor: primaryPurple }}>
                                {post.author_name || 'Autora Desconhecida'}
                            </Link>
                        ) : (
                            <p className="font-bold text-white">{post.author_name || 'Autora Desconhecida'}</p>
                        )}
                        <p className="text-sm" style={{ color: mutedColor }}>
                            {new Date(post.created_at).toLocaleString('pt-BR', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>

                {/* Conteúdo do Post */}
                <p className="whitespace-pre-wrap text-lg" style={{ color: textColor }}>
                    {post.content}
                </p>
            </div>

            {/* Imagem do Post */}
            {post.image_url && (
                <div className="relative w-full aspect-video mt-2">
                    <Image 
                        src={post.image_url} 
                        alt="Imagem da postagem" 
                        fill
                        className="object-cover"
                    />
                </div>
            )}

            {/* Ações do Post */}
            <div className="flex justify-around items-center p-2 border-t" style={{ borderColor: '#4A5568' }}>
                <button onClick={handleLike} className="...">
                    {isLiked ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
                    <span>{likeCount}</span>
                </button>
                <button onClick={handleToggleComments} className="...">
                    <FaRegCommentDots size={20} />
                    <span>Comentar</span>
                </button>
                <button className="...">
                    <FaShare size={20} />
                    <span>Compartilhar</span>
                </button>
            </div>

            {/* Seção de Comentários (Condicional) */}
            {showComments && (
                <div className="p-5 border-t" style={{ borderColor: '#4A5568' }}>
                    {isLoadingComments ? (
                        <div className="flex justify-center items-center">
                            <FaSpinner className="animate-spin text-xl" style={{ color: primaryPink }} />
                        </div>
                    ) : (
                        <div className="space-y-4 mb-4">
                            {comments.length > 0 ? comments.map(comment => (
                                <div key={comment._id} className="text-sm">
                                    <span className="font-bold text-white">{comment.author_name}: </span>
                                    <span className="text-gray-300">{comment.content}</span>
                                </div>
                            )) : <p className="text-sm text-gray-400">Nenhum comentário ainda. Seja o primeiro!</p>}
                        </div>
                    )}
                    
                    {/* Formulário para novo comentário */}
                    <form onSubmit={handleCommentSubmit} className="flex gap-2">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Escreva um comentário..."
                            className="w-full bg-[#4A5568] p-2 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8A2BE2]"
                        />
                        <button type="submit" disabled={isSubmittingComment} className="bg-[#8A2BE2] text-white font-bold px-4 rounded-lg hover:bg-purple-600 disabled:opacity-50">
                            {isSubmittingComment ? <FaSpinner className="animate-spin"/> : "Enviar"}
                        </button>
                    </form>
                </div>
            )}
        
        </div>
    );
}