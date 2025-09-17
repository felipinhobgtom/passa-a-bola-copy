'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

// 1. A função agora aceita 'selectedPosition' como uma prop
export default function EventsMapWrapper({ events, selectedPosition }) {
  
  const Map = useMemo(() => dynamic(
    () => import('./MapComponent'),
    {
      loading: () => <p className="text-center">Carregando mapa...</p>,
      ssr: false
    }
  ), []);

  // 2. A prop 'selectedPosition' é passada para o componente do mapa
  return <Map events={events} selectedPosition={selectedPosition} />;
}