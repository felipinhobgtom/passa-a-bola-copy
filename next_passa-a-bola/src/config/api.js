// API configuration
// Server-side (inside the frontend container): talk to the backend service name.
// Client-side (in the user's browser): talk to the host-exposed port (e.g., localhost:8000).

const isServer = typeof window === 'undefined';

const API_URL = isServer
	? process.env.INTERNAL_API_URL || 'http://backend:8000'
	: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default API_URL;