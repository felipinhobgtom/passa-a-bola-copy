'use client';
import API_URL, { apiPath } from '@/config/api';
// app/noticias/[id]/page.js

import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';

export default function ArticlePage() {
    const params = useParams();
    const [article, setArticle] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const { id } = params;
        if (!id) return;

        const token = localStorage.getItem('accessToken');
        if (!token) {
            setIsLoading(false);
            return;
        }

        async function fetchArticleDetails() {
            try {
                const res = await fetch(apiPath(`/api/news/${id}`), {
                    cache: 'no-store',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!res.ok) {
                    if (res.status === 404) notFound();
                    throw new Error('Failed to fetch article');
                }
                const data = await res.json();
                setArticle(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchArticleDetails();
    }, [params]);

    if (isLoading) {
        return <p className="text-center">Carregando artigo...</p>;
    }

    if (!article) {
        return (
            <div className="text-center">
                <p>Artigo não encontrado ou você precisa estar logado para vê-lo.</p>
                <Link href="/login" className="text-amber-400 hover:underline mt-4 inline-block">Fazer Login</Link>
            </div>
        );
    }

    const publishedDate = new Date(article.published_at).toLocaleDateString('pt-BR', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <article className="max-w-4xl mx-auto py-8">
            <Link href="/noticias" className="text-amber-400 hover:underline mb-6 block">&larr; Voltar para Notícias</Link>

            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">{article.title}</h1>
            <div className="text-gray-400 mb-6">
                <span>Por {article.author || 'Fonte Desconhecida'}</span> | <span>Publicado em {publishedDate}</span>
            </div>

            {article.image_url && (
                <img src={article.image_url} alt={article.title} className="w-full rounded-lg mb-8" />
            )}

            <div className="prose prose-invert prose-lg max-w-none text-gray-300">
                {/* Esta linha já mostra todo o conteúdo que a API fornece */}
                <p>{article.content || article.description}</p>
            </div>

            {/* Este botão é a solução para o limite da API */}
            <a 
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg"
            >
                Ler Artigo Original
            </a>
        </article>
    );
}