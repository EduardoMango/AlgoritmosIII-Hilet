import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Guarda para rutas exclusivas de usuarios no autenticados (ej: /login).
 * Si un usuario con sesión activa intenta acceder, es reenviado inmediatamente al panel.
 */
export const RutaPublicaExclusiva: React.FC = () => {
  const { estaAutenticado, cargandoAutenticacion } = useAuth();

  if (cargandoAutenticacion) {
    return null; // Omitir renderizado transitorio durante hidratación
  }

  if (estaAutenticado) {
    return <Navigate to="/panel" replace />;
  }

  return <Outlet />;
};

