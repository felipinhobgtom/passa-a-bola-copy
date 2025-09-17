// app/players/page.js
'use client';
import { useState, useEffect } from 'react';
import PlayerCard from '../components/PlayerCard';
import API_URL from '@/config/api';

export default function PlayersPage() {
  const [players, setPlayers] = useState([]);
  const [position, setPosition] = useState('');
  const [nationality, setNationality] = useState('');

  useEffect(() => {
    async function fetchPlayers() {
      // Build query string based on filters
      const params = new URLSearchParams();
      if (position) params.append('position', position);
      if (nationality) params.append('nationality', nationality);
      
  const res = await fetch(`${API_URL}/api/players?${params.toString()}`);
      const data = await res.json();
      setPlayers(data);
    }
    fetchPlayers();
  }, [position, nationality]); // Refetch when filters change

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Procurar Jogadoras</h1>
      <div className="flex gap-4 mb-6 p-4 bg-gray-800 rounded-lg">
        <input 
          type="text" 
          placeholder="Filtrar por posição..."
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          className="p-2 rounded bg-gray-700"
        />
        <input 
          type="text" 
          placeholder="Filtrar por nacionalidade..."
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
          className="p-2 rounded bg-gray-700"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {players.map(player => (
          <PlayerCard key={player._id} player={player} />
        ))}
      </div>
    </div>
  );
}