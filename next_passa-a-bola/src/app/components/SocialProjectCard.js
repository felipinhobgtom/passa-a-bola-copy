'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaMapMarkerAlt, FaGlobe } from 'react-icons/fa';

export default function SocialProjectCard({ project }) {
    const primaryPink = '#E84F7F';
    const cardBg = '#2D3748';
    const purplePillBg = 'rgba(138, 43, 226, 0.3)'; // Roxo com transparência

    return (
        <div 
            className="flex flex-col rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10"
            style={{ backgroundColor: cardBg }}
        >
            <div className="relative w-full h-56">
                <Image
                    src={project.image_url || '/placeholder-project.jpg'} // Tenha uma imagem placeholder
                    alt={`Imagem do projeto ${project.name}`}
                    layout="fill"
                    className="object-cover"
                />
            </div>
            
            <div className="p-6 flex flex-col flex-grow">
                {project.location && (
                    <p 
                        className="self-start text-sm font-semibold py-1 px-3 rounded-full mb-3 flex items-center gap-2"
                        style={{ backgroundColor: purplePillBg, color: '#C4B5FD' }} // Tom de roxo claro
                    >
                        <FaMapMarkerAlt /> {project.location}
                    </p>
                )}
                <h3 className="text-2xl font-bold text-white mb-2 flex-grow">
                    {project.name}
                </h3>
                <p className="text-gray-300 text-base mb-6">
                    {project.description}
                </p>
                
                <div className="mt-auto border-t pt-4" style={{ borderColor: '#4A5568' }}>
                    <Link 
                        href={project.website_url || '#'} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-2 font-bold py-2 px-5 rounded-lg text-white transition-transform transform hover:scale-105"
                        style={{ backgroundColor: primaryPink }}
                    >
                        <FaGlobe /> Saiba Mais
                    </Link>
                </div>
            </div>
        </div>
    );
}