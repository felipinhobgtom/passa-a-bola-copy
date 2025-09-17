import API_URL from '@/config/api';
import { FaInstagram, FaTwitter, FaBirthdayCake, FaUser, FaEye } from 'react-icons/fa';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import MediaGallery from '../../components/MediaGallery';

async function getProfileData(id) {
    const res = await fetch(`${API_URL}/api/profiles/${id}`, { cache: 'no-store' });
    if (!res.ok) notFound();
    return res.json();
}

async function getProfileMedia(id) {
    // Nota: Crie esta rota no seu backend para retornar as mídias de um perfil
    const res = await fetch(`${API_URL}/api/profiles/${id}/media`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
}

async function getProfileMetrics(id) {
    // Nota: Crie esta rota para retornar as métricas
    const res = await fetch(`${API_URL}/api/profiles/${id}/metrics`, { cache: 'no-store' });
    if (!res.ok) return { view_count: 0 };
    return res.json();
}

// Componente para os cartões de estatísticas
const StatCard = ({ icon, value, label, color }) => (
    <div className="p-6 rounded-xl text-center" style={{ backgroundColor: '#2D3748' }}>
        <div className="text-4xl mx-auto mb-2" style={{ color }}>{icon}</div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-sm font-semibold text-gray-400">{label}</p>
    </div>
);

export default async function ProfilePage({ params }) {
    const { id } = params; 

    const [profile, media, metrics] = await Promise.all([
        getProfileData(id),
        getProfileMedia(id),
        getProfileMetrics(id)
    ]);

    const calculateAge = (birthDate) => {
        if (!birthDate) return 'N/A';
        const age = new Date().getFullYear() - new Date(birthDate).getFullYear();
        const m = new Date().getMonth() - new Date(birthDate).getMonth();
        if (m < 0 || (m === 0 && new Date().getDate() < new Date(birthDate).getDate())) {
            return age - 1;
        }
        return age;
    };

    const primaryPink = '#E84F7F';
    const primaryPurple = '#8A2BE2';
    const primaryGreen = '#4CAF50';

    return (
        <div className="bg-[#1A202C] min-h-screen text-white">
            {/* Banner Header */}
            <header 
                className="relative h-64 md:h-80 w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${profile.image_url || '/default-banner.jpg'})` }} // Use uma imagem de banner padrão
            >
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A202C] via-transparent to-black/50 backdrop-blur-sm"></div>
                <div className="absolute -bottom-24 md:-bottom-28 left-1/2 -translate-x-1/2 text-center w-full px-4">
                    <div className="relative w-40 h-40 md:w-48 md:h-48 mx-auto">
                        <Image
                            src={profile.image_url || '/default-avatar.png'}
                            alt={`Foto de ${profile.full_name}`}
                            layout="fill"
                            className="rounded-full object-cover border-4 shadow-lg"
                            style={{ borderColor: primaryPink }}
                        />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold mt-4">{profile.full_name}</h1>
                    <p 
                        className="inline-block font-bold text-lg capitalize mt-2 py-1 px-4 rounded-full text-white"
                        style={{ backgroundColor: primaryPurple }}
                    >
                        {profile.position || 'Atleta'}
                    </p>
                    <div className="flex justify-center gap-6 mt-4">
                        {profile.social_links?.instagram && (
                            <a href={profile.social_links.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                                <FaInstagram size={28}/>
                            </a>
                        )}
                        {profile.social_links?.twitter && (
                            <a href={profile.social_links.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                                <FaTwitter size={28}/>
                            </a>
                        )}
                    </div>
                </div>
            </header>

            {/* Corpo do Perfil */}
            <main className="pt-32 md:pt-36">
                <div className="container mx-auto p-8">
                    {/* Seção de Estatísticas */}
                    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        <StatCard icon={<FaBirthdayCake />} value={`${calculateAge(profile.birth_date)} anos`} label="Idade" color={primaryPink} />
                        <StatCard icon={<FaUser />} value={profile.position || 'N/A'} label="Posição" color={primaryPurple} />
                        <StatCard icon={<FaEye />} value={metrics.view_count || 0} label="Visualizações" color={primaryGreen} />
                    </section>

                    {/* Seção Sobre Mim */}
                    {profile.bio && (
                        <section className="bg-[#2D3748] p-8 rounded-xl mb-12">
                            <h2 className="text-3xl font-bold mb-4 text-white">Sobre Mim</h2>
                            <p className="text-lg text-gray-300 whitespace-pre-wrap leading-relaxed">{profile.bio}</p>
                        </section>
                    )}
                    
                    {/* Seção Galeria de Mídia */}
                    <section>
                        <MediaGallery media={media} />
                    </section>
                </div>
            </main>
        </div>
    );
}