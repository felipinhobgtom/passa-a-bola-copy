// LandingPage.js
// Componente da Landing Page para o projeto Radar da Bola (Passa a Bola)
// Desenvolvido por: Calçada LTDA (Caio, Murilo, Bernardo)

import Link from 'next/link';
import Image from 'next/image'; // Importar o componente Image do Next.js
import { FaFutbol, FaSearch, FaMapMarkedAlt, FaNewspaper, FaUsers, FaHandshake } from 'react-icons/fa';

export default function LandingPage() {
  // Definindo as cores da paleta conforme o logo e as informações
  const primaryPink = '#E84F7F'; // Rosa vibrante
  const primaryPurple = '#8A2BE2'; // Roxo vibrante
  const primaryGreen = '#4CAF50'; // Verde (para destaques e o aro do logo)
  const darkBg = '#1A202C'; // Fundo mais escuro (quase preto)
  const semiDarkBg = '#2D3748'; // Fundo intermediário

  return (
    <div className={`bg-[${darkBg}] text-white font-sans`}>
      
      
      {/* Seção Hero */}
      <section 
        className="relative text-center h-screen flex items-center justify-center bg-cover bg-center" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1551957997-6c39e24e5a95?q=80&w=2070&auto=format&fit=crop')" }} // Imagem de fundo de futebol feminino
      >
        <div className="absolute inset-0 bg-black bg-opacity-70"></div> {/* Overlay para escurecer a imagem */}
        <div className="relative z-10 p-4">
          <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-tight">
            Liberte Seu Potencial no <span style={{ color: primaryPink }}>Futebol Feminino</span>.
          </h1>
          <p className="text-xl lg:text-2xl mt-4 max-w-3xl mx-auto text-gray-300">
            Conectando sonhos, construindo carreiras. Sua plataforma completa para brilhar dentro e fora de campo.
          </p>
          <div className="mt-10">
            <Link 
              href="/register" 
              className="font-bold py-4 px-10 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-lg"
              style={{ backgroundColor: primaryPurple, color: 'white' }} // Botão CTA principal em roxo
            >
              Comece a Jogar Agora
            </Link>
          </div>
        </div>
      </section>

      {/* Seção "Para Quem?" */}
      <section className={`py-20 bg-[${darkBg}]`}>
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Sua Paixão, Nosso Jogo.</h2>
          <p className="text-gray-400 mb-12 text-lg">O Radar da Bola é feito para todas que amam e vivem o futebol feminino.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<FaFutbol size={40} style={{ color: primaryPink }} />}
              title="Para Atletas"
              description="Mostre seu talento, encontre as melhores oportunidades e impulsione sua carreira."
              bgColor={semiDarkBg}
            />
            <FeatureCard
              icon={<FaSearch size={40} style={{ color: primaryPurple }} />}
              title="Para Olheiros & Clubes"
              description="Descubra novos talentos, gerencie eventos e fortaleça seu time com as futuras estrelas."
              bgColor={semiDarkBg}
            />
            <FeatureCard
              icon={<FaUsers size={40} style={{ color: primaryGreen }} />}
              title="Para Fãs & Comunidade"
              description="Acompanhe de perto, celebre conquistas e apoie o crescimento do futebol feminino."
              bgColor={semiDarkBg}
            />
          </div>
        </div>
      </section>

      {/* Seção de Funcionalidades */}
      <section className={`py-20 bg-[${semiDarkBg}]`}>
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">O Que Você Encontra Aqui?</h2>
          <div className="space-y-16">
            <InfoPill
              icon={<FaMapMarkedAlt size={50} style={{ color: primaryPink }}/>}
              title="Mapa Interativo de Oportunidades"
              description="Visualize jogos, peneiras e torneios acontecendo perto de você. Quer jogar? Use o 'Quero Jogar Aqui' e conecte-se!"
              align="left"
            />
            <InfoPill
              icon={<FaNewspaper size={50} style={{ color: primaryPurple }}/>}
              title="Notícias e Visibilidade"
              description="Mantenha-se atualizada com as últimas notícias, crie seu perfil de destaque e seja vista por quem realmente importa."
              align="right"
            />
            <InfoPill
              icon={<FaHandshake size={50} style={{ color: primaryGreen }}/>}
              title="Comunidade Ativa & Projetos Sociais"
              description="Conecte-se com outras apaixonadas, acompanhe seus times e inspire-se com projetos que impulsionam o esporte."
              align="left"
            />
          </div>
        </div>
      </section>
      
      {/* Seção Final de CTA */}
      <section 
        className="py-20 text-gray-900" 
        style={{ backgroundColor: primaryPink }} // Seção CTA final em rosa
      >
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white">Seu Lugar no Futebol Feminino é Aqui.</h2>
          <p className="text-xl mt-4 mb-8 text-white">Junte-se ao movimento. Cadastre-se e faça a diferença!</p>
          <Link 
            href="/register" 
            className="font-bold py-4 px-10 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-lg"
            style={{ backgroundColor: darkBg, color: 'white' }} // Botão CTA final em cor de fundo escura
          >
            Quero Fazer Parte!
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={`bg-[${darkBg}] text-gray-400 py-8`}>
        <div className="container mx-auto px-6 text-center">
          <p className="font-bold text-lg" style={{ color: primaryPink }}>Radar da Bola</p>
          <p className="text-sm mt-2">Um projeto da Calçada LTDA.</p>
          <p className="text-xs mt-1">Caio M. Lins (559805) • Murilo B. Gonzalez (566199) • Bernardo G. Lozório (564943)</p>
        </div>
      </footer>
    </div>
  );
}

// Componente auxiliar para os cards de feature
function FeatureCard({ icon, title, description, bgColor }) {
  return (
    <div className={`p-8 rounded-xl transform hover:-translate-y-2 transition-transform duration-300`} style={{ backgroundColor: bgColor }}>
      <div className="mb-5 inline-block">{icon}</div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
}

// Componente auxiliar para as pílulas de informação
function InfoPill({ icon, title, description, align }) {
  const alignment = align === 'right' ? 'md:flex-row-reverse' : 'md:flex-row';
  return (
    <div className={`flex flex-col md:items-center gap-8 ${alignment}`}>
      <div className="flex-shrink-0">{icon}</div>
      <div className={align === 'right' ? 'md:text-right' : ''}>
        <h3 className="text-3xl font-bold mb-3">{title}</h3>
        <p className="text-gray-300 text-lg">{description}</p>
      </div>
    </div>
  );
}