// API configuration
// Server-side: use the Docker service name.
// Client-side: use relative URLs and let Next.js rewrites proxy to the backend container.

const isServerSide = () => typeof window === 'undefined';

const getApiBase = () =>
	isServerSide() ? (process.env.INTERNAL_API_URL || 'http://backend:8000') : '';

// Export a dynamic value that resolves at runtime in both server and client.
// Using Symbol.toPrimitive ensures template literals like `${API_URL}/api/...`
// stringify this object into the correct base URL for the current runtime.
const API_URL = {
	[Symbol.toPrimitive]: () => getApiBase(),
	toString: () => getApiBase(),
	valueOf: () => getApiBase(),
};

// Build a full URL only on the server; return a relative path on the client
const apiPath = (path) => (isServerSide() ? `${getApiBase()}${path}` : path);

export default API_URL;
export { getApiBase, apiPath };