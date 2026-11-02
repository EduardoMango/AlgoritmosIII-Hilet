// Modelo formal de las afirmaciones extraídas del token JWT
export interface JwtPayloadUsuario {
  id?: number;
  sub?: string;
  username?: string;
  email?: string;
  role?: string;
  roles?: string[];
  exp: number;
  iat?: number;
  [key: string]: unknown;
}

// Modelo de sesión de usuario en el frontend
export interface UsuarioSesion {
  id: number | string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender?: string;
  image?: string;
  roles: string[];
}

// Respuesta devuelta por POST https://dummyjson.com/auth/login
export interface RespuestaLogin {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
  role?: string;
}

// Respuesta devuelta por POST https://dummyjson.com/auth/refresh
export interface RespuestaRefresh {
  accessToken: string;
  refreshToken: string;
}

// Perfil devuelto por GET https://dummyjson.com/auth/me
export interface PerfilUsuario {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  role?: string;
  birthDate?: string;
  phone?: string;
  address?: {
    address: string;
    city: string;
    state: string;
  };
  company?: {
    name: string;
    title: string;
    department: string;
  };
}

// Tipado formal del contexto de autenticación
export interface AuthContextType {
  usuario: UsuarioSesion | null;
  token: string | null;
  refreshToken: string | null;
  estaAutenticado: boolean;
  cargandoAutenticacion: boolean;
  iniciarSesion: (datos: RespuestaLogin) => void;
  cerrarSesion: () => void;
  actualizarTokens: (nuevoAccessToken: string, nuevoRefreshToken?: string) => void;
  corromperAccessTokenParaPrueba: () => void;
}

