/**
 * Application API Configuration
 * Reads the backend base URL from Vite environment variable `VITE_BACKEND_URL`.
 * Defaults to 'http://localhost:8080' if undefined.
 */
const rawBaseUrl = import.meta.env.VITE_BACKEND_URL || `${window.location.protocol}//${window.location.hostname}:8080`;

// Remove trailing slash if present
export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, '');
