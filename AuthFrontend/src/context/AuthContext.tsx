import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { AuthContextType, UsuarioSesion, RespuestaLogin } from '../types/auth';
import { decodificarToken, estaTokenExpirado } from '../utils/jwt';
import {
  CLAVE_ACCESS_TOKEN,
  CLAVE_REFRESH_TOKEN,
  CLAVE_USUARIO,
  authService
} from '../services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<UsuarioSesion | null>(null);
  const [cargandoAutenticacion, setCargandoAutenticacion] = useState<boolean>(true);

  // Cierre de sesión y purga de credenciales
  const cerrarSesion = useCallback(() => {
    localStorage.removeItem(CLAVE_ACCESS_TOKEN);
    localStorage.removeItem(CLAVE_REFRESH_TOKEN);
    localStorage.removeItem(CLAVE_USUARIO);
    setToken(null);
    setRefreshToken(null);
    setUsuario(null);
  }, []);

  // Actualización controlada de tokens en memoria reactiva
  const actualizarTokens = useCallback((nuevoAccessToken: string, nuevoRefreshToken?: string) => {
    localStorage.setItem(CLAVE_ACCESS_TOKEN, nuevoAccessToken);
    setToken(nuevoAccessToken);

    if (nuevoRefreshToken) {
      localStorage.setItem(CLAVE_REFRESH_TOKEN, nuevoRefreshToken);
      setRefreshToken(nuevoRefreshToken);
    }

    // Re-sincronizar el usuario con las claims del nuevo token si es necesario
    const payload = decodificarToken(nuevoAccessToken);
    if (payload) {
      setUsuario((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          roles: payload.role ? [payload.role.toUpperCase()] : (payload.roles || prev.roles)
        };
      });
    }
  }, []);

  // Inicio de sesión: sincroniza estado y persistencia
  const iniciarSesion = useCallback((datos: RespuestaLogin) => {
    const rolesCalculados: string[] = [];

    // 1. Rol traído explícitamente desde /auth/me o login
    if (datos.role) {
      rolesCalculados.push(datos.role.toUpperCase());
    }

    // 2. Afirmación del token si existiera
    const payload = decodificarToken(datos.accessToken);
    if (payload?.role) {
      const rolToken = payload.role.toUpperCase();
      if (!rolesCalculados.includes(rolToken)) {
        rolesCalculados.push(rolToken);
      }
    }

    // 3. Respaldo para fines de prueba: emilys siempre se inyecta como ADMIN
    if (datos.username?.toLowerCase() === 'emilys' && !rolesCalculados.includes('ADMIN')) {
      rolesCalculados.push('ADMIN');
    }

    // Rol por defecto si no viniera ninguno
    if (rolesCalculados.length === 0) {
      rolesCalculados.push('USER');
    }

    const perfilSesion: UsuarioSesion = {
      id: datos.id,
      username: datos.username,
      email: datos.email,
      firstName: datos.firstName,
      lastName: datos.lastName,
      gender: datos.gender,
      image: datos.image,
      roles: rolesCalculados
    };

    localStorage.setItem(CLAVE_ACCESS_TOKEN, datos.accessToken);
    localStorage.setItem(CLAVE_REFRESH_TOKEN, datos.refreshToken);
    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(perfilSesion));

    setToken(datos.accessToken);
    setRefreshToken(datos.refreshToken);
    setUsuario(perfilSesion);
  }, []);

  // Utilidad demostrativa para probar el refresh silencioso
  const corromperAccessTokenParaPrueba = useCallback(() => {
    const tokenCorrupto = 'token_expirado_o_invalido_para_demostracion';
    localStorage.setItem(CLAVE_ACCESS_TOKEN, tokenCorrupto);
    setToken(tokenCorrupto);
  }, []);

  // Hidratación inicial de la sesión al montar el proveedor (previene FOUC)
  useEffect(() => {
    const restaurarSesion = async () => {
      try {
        const tokenPersistido = localStorage.getItem(CLAVE_ACCESS_TOKEN);
        const refreshPersistido = localStorage.getItem(CLAVE_REFRESH_TOKEN);
        const usuarioPersistidoRaw = localStorage.getItem(CLAVE_USUARIO);

        if (tokenPersistido && usuarioPersistidoRaw) {
          const usuarioPersistido = JSON.parse(usuarioPersistidoRaw) as UsuarioSesion;

          // Asegurar rol ADMIN para emilys ante recargas de página
          if (usuarioPersistido.username?.toLowerCase() === 'emilys' && !usuarioPersistido.roles?.includes('ADMIN')) {
            usuarioPersistido.roles = [...(usuarioPersistido.roles || []), 'ADMIN'];
            localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuarioPersistido));
          }

          // Verificamos si el token de acceso sigue vigente
          if (!estaTokenExpirado(tokenPersistido)) {
            setToken(tokenPersistido);
            setRefreshToken(refreshPersistido);
            setUsuario(usuarioPersistido);
          } else if (refreshPersistido) {
            // El access token expiró pero existe refresh token: renovación silenciosa inicial
            try {
              const res = await authService.refrescarSesion(refreshPersistido);
              localStorage.setItem(CLAVE_ACCESS_TOKEN, res.accessToken);
              if (res.refreshToken) {
                localStorage.setItem(CLAVE_REFRESH_TOKEN, res.refreshToken);
                setRefreshToken(res.refreshToken);
              } else {
                setRefreshToken(refreshPersistido);
              }
              setToken(res.accessToken);
              setUsuario(usuarioPersistido);
            } catch (err) {
              console.warn('No se pudo restaurar la sesión mediante refresh token:', err);
              cerrarSesion();
            }
          } else {
            cerrarSesion();
          }
        }
      } catch (error) {
        console.error('Error al restaurar sesión previa:', error);
        cerrarSesion();
      } finally {
        setCargandoAutenticacion(false);
      }
    };

    restaurarSesion();
  }, [cerrarSesion]);

  // Escuchar eventos globales emitidos por el interceptor de Axios
  useEffect(() => {
    const manejarTokensActualizados = (e: Event) => {
      const eventoCustom = e as CustomEvent<{ accessToken: string; refreshToken?: string }>;
      if (eventoCustom.detail?.accessToken) {
        setToken(eventoCustom.detail.accessToken);
        if (eventoCustom.detail.refreshToken) {
          setRefreshToken(eventoCustom.detail.refreshToken);
        }
      }
    };

    const manejarSesionExpirada = () => {
      cerrarSesion();
    };

    window.addEventListener('auth:token-actualizado', manejarTokensActualizados);
    window.addEventListener('auth:sesion-expirada', manejarSesionExpirada);

    return () => {
      window.removeEventListener('auth:token-actualizado', manejarTokensActualizados);
      window.removeEventListener('auth:sesion-expirada', manejarSesionExpirada);
    };
  }, [cerrarSesion]);

  const valorContexto: AuthContextType = {
    usuario,
    token,
    refreshToken,
    estaAutenticado: token !== null && usuario !== null,
    cargandoAutenticacion,
    iniciarSesion,
    cerrarSesion,
    actualizarTokens,
    corromperAccessTokenParaPrueba
  };

  return (
    <AuthContext.Provider value={valorContexto}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook de consumo con salvaguarda estructural
export const useAuth = (): AuthContextType => {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error('useAuth debe ser consumido estrictamente dentro de un AuthProvider.');
  }
  return contexto;
};

