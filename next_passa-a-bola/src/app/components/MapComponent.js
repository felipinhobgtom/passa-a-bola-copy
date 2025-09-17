'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Componente auxiliar para mudar a visão do mapa programaticamente
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

const redPinIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

export default function MapComponent({ events, selectedPosition }) {
    const initialPosition = events.length > 0
        ? [events[0].location.latitude, events[0].location.longitude]
        : [-23.5505, -46.6333];

    return (
        <MapContainer center={initialPosition} zoom={10} style={{ height: '400px', width: '100%', borderRadius: '8px' }}>
            {/* Se uma posição foi selecionada, este componente mudará a visão do mapa com um zoom de 15 */}
            {selectedPosition && <ChangeView center={selectedPosition} zoom={15} />}
            
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {events.map(event => (
                <Marker key={event._id} position={[event.location.latitude, event.location.longitude]} icon={redPinIcon}>
                    <Popup>
                        <strong>{event.eventName}</strong><br />
                        Data: {new Date(event.date).toLocaleDateString('pt-BR')}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}