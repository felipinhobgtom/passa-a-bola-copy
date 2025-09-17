'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaExternalLinkAlt } from 'react-icons/fa';

export default function ArticleCard({ article }) {
    const primaryPink = '#E84F7F';
    const cardBg = '#2D3748';
    const textColor = '#CBD5E0';
    const mutedColor = '#718096';

    // Formata a data para um formato mais legível
    const formattedDate = new Date(article.publishedAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    return (
        <div 
            className="flex flex-col rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/10"
            style={{ backgroundColor: cardBg }}
        >
            <Link href={article.url} target="_blank" rel="noopener noreferrer" className="block">
                <div className="relative w-full h-48">
                    <Image
                        src={article.urlToImage || '/placeholder-news.jpg'} // Tenha uma imagem placeholder
                        alt={article.title || 'Imagem da notícia'}
                        layout="fill"
                        className="object-cover"
                    />
                </div>
            </Link>
            
            <div className="p-5 flex flex-col flex-grow">
                <p className="text-sm font-semibold" style={{ color: primaryPink }}>
                    {article.source?.name || 'Fonte Desconhecida'}
                </p>
                <h3 className="text-lg font-bold text-white mt-2 mb-3 flex-grow">
                    <Link href={article.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {article.title}
                    </Link>
                </h3>
                <p className="text-sm" style={{ color: mutedColor }}>
                    {formattedDate}
                </p>
                <div className="mt-4 border-t pt-4" style={{ borderColor: '#4A5568' }}>
                    <Link 
                        href={article.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-2 font-bold transition-colors"
                        style={{ color: primaryPink }}
                    >
                        Ler matéria completa <FaExternalLinkAlt />
                    </Link>
                </div>
            </div>
        </div>
    );
}