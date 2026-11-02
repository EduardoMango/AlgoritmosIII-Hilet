import React from 'react';
import { useAuth } from '../context/AuthContext';

interface ElementoSeguroPorRolProps {
  rolesRequeridos: string[];
  children: React.ReactNode;
}

/**
 * Componente granular para autorización visual en el árbol de componentes (RBAC fino).
 */
export const ElementoSeguroPorRol: React.FC<ElementoSeguroPorRolProps> = ({
  rolesRequeridos,
  children
}) => {
  const { usuario } = useAuth();

  if (!usuario) {
    return null;
  }

  const rolesRequeridosUpper = rolesRequeridos.map((r) => r.toUpperCase());
  const tienePermiso = usuario.roles.some((rol) => rolesRequeridosUpper.includes(rol.toUpperCase()));

  if (!tienePermiso) {
    return null;
  }

  return <>{children}</>;
};

