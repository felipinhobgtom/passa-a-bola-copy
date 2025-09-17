'use client';

import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaEye } from 'react-icons/fa';
import { useState } from 'react';

const NavItem = ({ href, children, onClick }) => {
    const pathname = usePathname();
    const isActive = pathname === href;
    return (
        <Link 
            href={href} 
            onClick={onClick}
            className={`font-semibold border-b-2 pb-1 transition-colors duration-300 ${isActive ? 'text-white border-[#8A2BE2]' : 'text-gray-300 border-transparent hover:text-white'}`}
        >
            {children}
        </Link>
    );
};

export default function Navbar() {
    const { isLoggedIn, user, userId, userRole, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    const primaryPink = '#E84F7F';
    const primaryGreen = '#4CAF50';
    const darkTransparentBg = 'rgba(26, 32, 44, 0.8)';

    const handleLinkClick = () => setIsMenuOpen(false);

    // AJUSTE: Variável para simplificar a verificação de role
    const isPlayer = userRole === 'jogadora_amadora' || userRole === 'jogadora_profissional';
    
    const mobileNavLinks = (
        <div className="flex flex-col items-start gap-6 mt-10" onClick={handleLinkClick}>
            <NavItem href="/feed">Feed</NavItem>
            {userRole === 'olheiro' && <NavItem href="/players">Buscar Jogadoras</NavItem>}
            <NavItem href="/tournaments">Torneios</NavItem>
            <NavItem href="/events">Mapa de Eventos</NavItem>
            <NavItem href="/noticias">Notícias</NavItem>
            <NavItem href="/projetos-sociais">Projetos Sociais</NavItem>
            <hr className="w-full border-gray-600 my-4" />
            
            {/* CORREÇÃO: Adicionada verificação 'isPlayer && userId' para evitar o erro 'undefined' */}
            {isPlayer && userId && (
                <>
                    <Link href={`/profile/${userId}`} className="flex items-center gap-3 font-bold text-white">
                        <FaEye /> Ver Meu Perfil
                    </Link>
                    <Link href={`/profile/editar`} className="flex items-center gap-3 font-bold text-white">
                        <FaUser /> Editar Meu Perfil
                    </Link>
                </>
            )}
            <button onClick={logout} className="w-full text-left flex items-center gap-3 font-bold text-red-400">
                <FaSignOutAlt /> Logout
            </button>
        </div>
    );

    return (
        <nav className="fixed top-0 left-0 w-full text-white p-4 shadow-lg z-50 backdrop-blur-md" style={{ backgroundColor: darkTransparentBg }}>
            <div className="container mx-auto flex justify-between items-center">
                {/* AJUSTE: Simplificado o href do Link do logo */}
                <Link href="/" className="flex items-center gap-3">
                    <Image src="/logo.jpg" alt="Logo Passa a Bola" width={40} height={40} className="rounded-full"/>
                    <span className="text-2xl font-extrabold" style={{ color: primaryPink }}>Passa a Bola</span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    {isLoggedIn ? (
                        <>
                            <NavItem href="/feed">Feed</NavItem>
                            {userRole === 'olheiro' && <NavItem href="/players">Buscar Jogadoras</NavItem>}
                            <NavItem href="/tournaments">Torneios</NavItem>
                            <NavItem href="/events">Mapa de Eventos</NavItem>
                            <NavItem href="/noticias">Notícias</NavItem>
                            <NavItem href="/projetos-sociais">Projetos Sociais</NavItem>
                            <NavItem href="/dashboard">Dashboard</NavItem>
                            
                            <div className="relative">
                                <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="block">
                                    <Image
                                        src={user?.image_url || '/default-avatar.png'}
                                        alt="Foto de perfil"
                                        width={40}
                                        height={40}
                                        className="rounded-full object-cover border-2 border-[#E84F7F] transition-transform transform hover:scale-110"
                                    />
                                </button>
                                
                                {isProfileMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-[#2D3748] rounded-lg shadow-xl py-2 z-50" onMouseLeave={() => setIsProfileMenuOpen(false)}>
                                        <div className="px-4 py-2 border-b border-gray-600">
                                            <p className="font-bold text-white truncate">{user?.full_name || 'Atleta'}</p>
                                            <p className="text-sm text-gray-400 capitalize">{userRole?.replace('_', ' ')}</p>
                                        </div>
                                        
                                        {/* CORREÇÃO: Adicionada verificação 'isPlayer && userId' para evitar o erro 'undefined' */}
                                        {isPlayer && userId && (
                                            <>
                                                <Link href={`/profile/${userId}`} onClick={() => setIsProfileMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-200 hover:bg-[#4A5568]">
                                                    <FaEye /> Ver Meu Perfil
                                                </Link>
                                                <Link href={`/profile/editar`} onClick={() => setIsProfileMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-200 hover:bg-[#4A5568]">
                                                    <FaUser /> Editar Perfil
                                                </Link>
                                            </>
                                        )}
                                        <button onClick={logout} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-[#4A5568]">
                                            <FaSignOutAlt /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <Link href="/login" className="font-bold py-2 px-6 rounded-lg transition-transform transform hover:scale-105" style={{ backgroundColor: primaryGreen, color: 'white' }}>
                            Login / Cadastrar
                        </Link>
                    )}
                </div>

                <div className="md:hidden">
                    {isLoggedIn ? (
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Abrir menu"><FaBars size={24} /></button>
                    ) : (
                         <Link href="/login" className="font-bold py-2 px-5 rounded-lg" style={{ backgroundColor: primaryGreen, color: 'white' }}>Login</Link>
                    )}
                </div>
            </div>

            {isLoggedIn && (
                <>
                    <div className={`fixed top-0 right-0 h-full w-72 p-8 transform transition-transform duration-300 ease-in-out md-hidden z-50 backdrop-blur-lg`} style={{ backgroundColor: darkTransparentBg, transform: isMenuOpen ? 'translateX(0)' : 'translateX(100%)' }}>
                        <button onClick={() => setIsMenuOpen(false)} className="absolute top-6 right-6" aria-label="Fechar menu"><FaTimes size={24} /></button>
                        {mobileNavLinks}
                    </div>
                    {isMenuOpen && <div className="fixed inset-0 bg-black/50 md:hidden z-40" onClick={() => setIsMenuOpen(false)}></div>}
                </>
            )}
        </nav>
    );
}