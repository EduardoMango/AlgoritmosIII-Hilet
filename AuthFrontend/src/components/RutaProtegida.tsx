import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface RutaProtegidaProps {
  rolesPermitidos?: string[];
}

export const RutaProtegida: React.FC<RutaProtegidaProps> = ({ rolesPermitidos }) => {
  const { estaAutenticado, cargandoAutenticacion, usuario } = useAuth();
  const location = useLocation();

  // 1. Suspensión de evaluación mientras se hidrata la sesión (evita FOUC)
  if (cargandoAutenticacion) {
    return (
      <div className="pantalla-carga">
        <div className="spinner"></div>
        <p className="texto-carga">Verificando credenciales de sesión...</p>
      </div>
    );
  }

  // 2. Redirección si no existe sesión válida, preservando la ruta de origen en state
  if (!estaAutenticado) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Verificación de privilegios basada en roles (RBAC)
  if (rolesPermitidos && rolesPermitidos.length > 0) {
    const tieneRolRequerido = usuario?.roles.some((rol) =>
      rolesPermitidos.includes(rol.toUpperCase())
    );

    if (!tieneRolRequerido) {
      return <Navigate to="/acceso-denegado" replace />;
    }
  }

  // 4. Renderizado seguro del recurso secundario anidado
  return <Outlet />;
};

