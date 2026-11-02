import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { RespuestaLogin, RespuestaRefresh, PerfilUsuario } from '../types/auth';

export const CLAVE_ACCESS_TOKEN = 'auth_access_token';
export const CLAVE_REFRESH_TOKEN = 'auth_refresh_token';
export const CLAVE_USUARIO = 'auth_user_data';

// Instancia centralizada de Axios apuntando a DummyJSON
export const clienteApi = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Control de concurrencia para evitar múltiples solicitudes simultáneas de refresco
let estaRefrescando = false;
let colaPeticionesPendientes: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const procesarCola = (error: unknown, token: string | null = null) => {
  colaPeticionesPendientes.forEach((promesa) => {
    if (error) {
      promesa.reject(error);
    } else if (token) {
      promesa.resolve(token);
    }
  });
  colaPeticionesPendientes = [];
};

// 1. Interceptor de Petición: Inyección automática de la cabecera Authorization
clienteApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem(CLAVE_ACCESS_TOKEN);

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 2. Interceptor de Respuesta: Tratamiento de 401 y Renovación Silenciosa con Refresh Token
clienteApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const peticionOriginal = error.config as InternalAxiosRequestConfig & { _reintento?: boolean };

    // Si no hay respuesta o no es un error 401, rechazar normalmente
    if (!error.response || error.response.status !== 401 || !peticionOriginal) {
      return Promise.reject(error);
    }

    // Si la petición que falló con 401 ya era el intento de refresh o ya fue reintentada, abortar
    if (peticionOriginal._reintento || peticionOriginal.url?.includes('/auth/refresh')) {
      limpiarSesionYRedirigir();
      return Promise.reject(error);
    }

    const tokenRefrescoActual = localStorage.getItem(CLAVE_REFRESH_TOKEN);

    // Si no hay refresh token almacenado, no es posible renovar
    if (!tokenRefrescoActual) {
      limpiarSesionYRedirigir();
      return Promise.reject(error);
    }

    // Si ya hay un refresco en curso, encolar esta petición hasta que finalice
    if (estaRefrescando) {
      return new Promise((resolve, reject) => {
        colaPeticionesPendientes.push({
          resolve: (nuevoToken: string) => {
            if (peticionOriginal.headers) {
              peticionOriginal.headers.Authorization = `Bearer ${nuevoToken}`;
            }
            resolve(clienteApi(peticionOriginal));
          },
          reject: (err) => {
            reject(err);
          }
        });
      });
    }

    // Iniciar el proceso de renovación
    peticionOriginal._reintento = true;
    estaRefrescando = true;

    try {
      // Petición directa con axios base para no activar interceptores recursivamente
      const respuesta = await axios.post<RespuestaRefresh>(
        'https://dummyjson.com/auth/refresh',
        {
          refreshToken: tokenRefrescoActual,
          expiresInMins: 30
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      const { accessToken: nuevoAccessToken, refreshToken: nuevoRefreshToken } = respuesta.data;

      // Persistir las nuevas credenciales
      localStorage.setItem(CLAVE_ACCESS_TOKEN, nuevoAccessToken);
      if (nuevoRefreshToken) {
        localStorage.setItem(CLAVE_REFRESH_TOKEN, nuevoRefreshToken);
      }

      // Notificar al contexto de React que las credenciales se actualizaron
      window.dispatchEvent(
        new CustomEvent('auth:token-actualizado', {
          detail: {
            accessToken: nuevoAccessToken,
            refreshToken: nuevoRefreshToken || tokenRefrescoActual
          }
        })
      );

      // Desbloquear peticiones en espera con el nuevo token
      procesarCola(null, nuevoAccessToken);

      // Reintentar la petición original con el nuevo token
      if (peticionOriginal.headers) {
        peticionOriginal.headers.Authorization = `Bearer ${nuevoAccessToken}`;
      }
      return clienteApi(peticionOriginal);
    } catch (refreshError) {
      procesarCola(refreshError, null);
      limpiarSesionYRedirigir();
      return Promise.reject(refreshError);
    } finally {
      estaRefrescando = false;
    }
  }
);

function limpiarSesionYRedirigir() {
  localStorage.removeItem(CLAVE_ACCESS_TOKEN);
  localStorage.removeItem(CLAVE_REFRESH_TOKEN);
  localStorage.removeItem(CLAVE_USUARIO);

  window.dispatchEvent(new CustomEvent('auth:sesion-expirada'));
}

// Endpoints del backend simulado con DummyJSON
export const authService = {
  // Inicio de sesión
  login: async (username: string, password: string): Promise<RespuestaLogin> => {
    const respuesta = await clienteApi.post<RespuestaLogin>('/auth/login', {
      username,
      password,
      expiresInMins: 30
    });

    const loginData = respuesta.data;
    let rolDetectado = 'USER';

    // DummyJSON no devuelve el rol en /auth/login ni en el payload del JWT,
    // pero sí lo retorna en GET /auth/me. Consultamos /auth/me para sincronizar el rol real.
    try {
      const perfilRespuesta = await axios.get<PerfilUsuario>('https://dummyjson.com/auth/me', {
        headers: {
          Authorization: `Bearer ${loginData.accessToken}`
        }
      });
      if (perfilRespuesta.data.role) {
        rolDetectado = perfilRespuesta.data.role.toUpperCase();
      }
    } catch (err) {
      console.warn('No se pudo consultar el rol desde /auth/me, aplicando rol por defecto:', err);
    }

    // Inyección hardcodeada de respaldo para fines de prueba solicitada por el usuario:
    // Garantiza que 'emilys' sea ADMIN independientemente de la respuesta del backend
    if (username.toLowerCase() === 'emilys') {
      rolDetectado = 'ADMIN';
    }

    return {
      ...loginData,
      role: rolDetectado
    };
  },

  // Consulta de perfil autenticado (/auth/me)
  obtenerPerfil: async (): Promise<PerfilUsuario> => {
    const respuesta = await clienteApi.get<PerfilUsuario>('/auth/me');
    const perfil = respuesta.data;

    // Si el usuario es emilys, garantizamos que el rol reflejado sea ADMIN
    if (perfil.username?.toLowerCase() === 'emilys' && !perfil.role) {
      perfil.role = 'admin';
    }

    return perfil;
  },

  // Refresco manual o explícito
  refrescarSesion: async (refreshToken: string): Promise<RespuestaRefresh> => {
    const respuesta = await clienteApi.post<RespuestaRefresh>('/auth/refresh', {
      refreshToken,
      expiresInMins: 30
    });
    return respuesta.data;
  }
};

