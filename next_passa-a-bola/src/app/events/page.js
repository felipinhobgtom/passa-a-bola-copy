// app/events/page.js
import EventsView from '../components/EventsView';
import API_URL from '@/config/api';

async function getEvents() {
    const res = await fetch(`${API_URL}/api/events`, { cache: 'no-store' });
    if (!res.ok) {
        console.error("Failed to fetch events from API");
        return [];
    }
    return res.json();
}

export default async function EventsMapPage() {
    const events = await getEvents();
    
    // A página do servidor agora apenas busca os dados e os passa para o componente de visualização
    return <EventsView events={events} />;
}