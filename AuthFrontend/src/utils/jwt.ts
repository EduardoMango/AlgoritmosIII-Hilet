import { jwtDecode } from 'jwt-decode';
import { JwtPayloadUsuario } from '../types/auth';

/**
 * Decodifica un JWT e infiere los tipos de forma segura.
 * Como se explica en el Bloque 6, el cliente decodifica el token exclusivamente
 * para sincronizar la interfaz visual, sin validar la firma criptográfica (responsabilidad del backend).
 */
export function decodificarToken(token: string): JwtPayloadUsuario | null {
  try {
    return jwtDecode<JwtPayloadUsuario>(token);
  } catch (error) {
    console.error('El token suministrado no posee un formato JWT válido:', error);
    return null;
  }
}

/**
 * Evalúa preventivamente si el token ha expirado según su marca UNIX exp.
 */
export function estaTokenExpirado(token: string): boolean {
  const payload = decodificarToken(token);
  if (!payload || !payload.exp) {
    return true;
  }
  const marcaActual = Math.floor(Date.now() / 1000);
  return payload.exp <= marcaActual;
}

