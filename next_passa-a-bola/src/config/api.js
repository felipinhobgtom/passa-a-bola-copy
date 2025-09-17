// API configuration
// Server-side (inside the frontend container): use the Docker service name.
// Client-side (in the user's browser): use relative URLs and let Next.js rewrites
// proxy the request to the backend container. This avoids hitting localhost directly.

const isServer = typeof window === 'undefined';

const API_URL = isServer
	? process.env.INTERNAL_API_URL || 'http://backend:8000'
	: process.env.NEXT_PUBLIC_API_URL || '';

export default API_URL;