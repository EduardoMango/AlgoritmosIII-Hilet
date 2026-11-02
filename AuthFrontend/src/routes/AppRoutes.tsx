import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { RutaProtegida } from '../components/RutaProtegida';
import { RutaPublicaExclusiva } from '../components/RutaPublicaExclusiva';
import { PaginaLogin } from '../pages/PaginaLogin';
import { PanelGeneral } from '../pages/PanelGeneral';
import { PaginaPerfil } from '../pages/PaginaPerfil';
import { PaginaAdmin } from '../pages/PaginaAdmin';
import { VistaAccesoDenegado } from '../pages/VistaAccesoDenegado';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Redirección por defecto */}
      <Route path="/" element={<Navigate to="/panel" replace />} />

      {/* Rutas exclusivas para usuarios sin autenticar */}
      <Route element={<RutaPublicaExclusiva />}>
        <Route path="/login" element={<PaginaLogin />} />
      </Route>

      {/* Rutas operativas protegidas para cualquier usuario autenticado */}
      <Route element={<RutaProtegida />}>
        <Route path="/panel" element={<PanelGeneral />} />
        <Route path="/perfil" element={<PaginaPerfil />} />
      </Route>

      {/* Rutas con restricción RBAC: requiere rol ADMIN */}
      <Route element={<RutaProtegida rolesPermitidos={['ADMIN']} />}>
        <Route path="/admin" element={<PaginaAdmin />} />
      </Route>

      {/* Rutas públicas informativas de fallback */}
      <Route path="/acceso-denegado" element={<VistaAccesoDenegado />} />
      <Route path="*" element={<Navigate to="/panel" replace />} />
    </Routes>
  );
};

