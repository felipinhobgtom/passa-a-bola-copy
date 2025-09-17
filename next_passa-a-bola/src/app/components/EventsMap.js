// app/components/EventsMap.js
'use client'; // 1. Este é o Client Component

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

// 2. A lógica de importação dinâmica é movida para cá
export default function EventsMap({ events }) {
  const Map = useMemo(() => dynamic(
    () => import('./MapComponent'), // Importa o seu mapa Leaflet
    {
      loading: () => <p className="text-center">Carregando mapa...</p>,
      ssr: false // Desabilita a renderização no servidor
    }
  ), []);

  return <Map events={events} />;
}