/**
 * Resolve backend-relative media URLs so uploaded videos/thumbnails work when
 * the frontend is hosted on a DIFFERENT origin than the API — e.g. a Vercel
 * frontend talking to a Render/Railway backend.
 *
 * The backend stores URLs like "/uploads/{userId}/{filename}". In local dev
 * the Vite proxy serves them, but on a deployed frontend the browser would
 * resolve them against the FRONTEND origin and get a 404.
 */
const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

// Strip a trailing "/api" (the axios baseURL) to get the API origin.
const API_ORIGIN = API_BASE.replace(/\/api$/, '');

export const resolveMediaUrl = (url) => {
  if (!url) return url;
  // Absolute URLs pass through unchanged.
  if (/^https?:\/\//i.test(url)) return url;
  // Backend-relative paths (e.g. /uploads/...) become fully absolute.
  if (url.startsWith('/')) return `${API_ORIGIN}${url}`;
  return url;
};
