// app/components/PlayerCard.js
export default function PlayerCard({ player }) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-bold">{player.name}</h3>
      <p>Posição: {player.position}</p>
      <p>Nacionalidade: {player.nationality}</p>
      <p>Time: {player.team}</p>
      <p>Idade: {player.age}</p>
    </div>
  );
}