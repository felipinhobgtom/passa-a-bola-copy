'use client';

import Image from 'next/image';
import { FaPhotoVideo } from 'react-icons/fa';

export default function MediaGallery({ media }) {
    if (!media || media.length === 0) {
        return (
            <div className="bg-[#2D3748] p-10 rounded-xl text-center">
                <FaPhotoVideo className="mx-auto text-5xl text-gray-500 mb-4" />
                <h3 className="text-xl font-bold">Galeria Vazia</h3>
                <p className="text-gray-400">Esta atleta ainda não adicionou nenhuma foto ou vídeo.</p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-white">Minha Galeria</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {media.map((item) => (
                    <div key={item._id} className="relative aspect-square rounded-lg overflow-hidden group">
                        {item.media_type === 'image' ? (
                            <Image
                                src={item.url}
                                alt="Mídia da galeria"
                                layout="fill"
                                className="object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                        ) : (
                            <video controls className="w-full h-full object-cover">
                                <source src={item.url} type="video/mp4" />
                                Seu navegador não suporta o vídeo.
                            </video>
                        )}
                         <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}