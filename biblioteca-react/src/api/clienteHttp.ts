import axios from 'axios';

/**
 * Cliente HTTP Centralizado (Axios)
 * ===================================
 * Basado en las directrices de arquitectura del Bloque 3:
 * 1. Desacopla la URL del backend y configuración de transporte de los componentes React.
 * 2. Lee variables de entorno provistas por Vite con prefijo `VITE_` (import.meta.env).
 * 3. Incorpora interceptores para enriquecer peticiones salientes y normalizar errores entrantes.
 * 4. Define un timeout declarativo para evitar peticiones colgadas.
 */

const URL_BASE_API = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const TIEMPO_LIMITE_MS = Number(import.meta.env.VITE_TIMEOUT_MS) || 10000;

export const clienteHttp = axios.create({
  baseURL: URL_BASE_API,
  timeout: TIEMPO_LIMITE_MS,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor de Solicitud (Request Interceptor)
// Permite auditar peticiones salientes y agregar encabezados comunes
clienteHttp.interceptors.request.use(
  (configuracion) => {
    // Ejemplo pedagógico: registro de auditoría en consola de desarrollo
    if (import.meta.env.DEV) {
      console.info(`[HTTP ${configuracion.method?.toUpperCase()}] ➔ ${configuracion.baseURL}${configuracion.url}`);
    }
    return configuracion;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de Respuesta (Response Interceptor)
// Estandariza la captura de respuestas erróneas (códigos 4xx / 5xx o fallos de red)
clienteHttp.interceptors.response.use(
  (respuesta) => {
    return respuesta;
  },
  (error) => {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ERR_NETWORK') {
        console.error('[HTTP ERROR] Fallo de conexión de red con JSON Server. Verifique si el servidor está activo (npm run server).');
      } else if (error.code === 'ECONNABORTED') {
        console.error(`[HTTP ERROR] Tiempo de espera límite agotado (${TIEMPO_LIMITE_MS}ms).`);
      }
    }
    return Promise.reject(error);
  }
);
