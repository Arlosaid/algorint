/**
 * Configuración compartida.
 * En Vercel: añade la variable de entorno VITE_API_URL con la URL de tu backend (ej: https://algorint.onrender.com).
 */
export const API_BASE_URL =
  ((import.meta as any).env?.VITE_API_URL as string | undefined) || "http://localhost:8000";
