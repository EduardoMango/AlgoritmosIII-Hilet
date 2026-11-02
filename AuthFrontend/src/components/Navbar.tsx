import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { estaAutenticado, usuario, cerrarSesion } = useAuth();
  const navigate = useNavigate();

  const handleCerrarSesion = () => {
    cerrarSesion();
    navigate('/login', { replace: true });
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <span className="brand-logo">SEC</span>
          <span className="brand-text">AuthSecurity Demo</span>
        </div>

        <nav className="navbar-links">
          {estaAutenticado ? (
            <>
              <NavLink
                to="/panel"
                className={({ isActive }) => (isActive ? 'nav-link activo' : 'nav-link')}
              >
                Panel
              </NavLink>
              <NavLink
                to="/perfil"
                className={({ isActive }) => (isActive ? 'nav-link activo' : 'nav-link')}
              >
                Perfil Completo
              </NavLink>
              <NavLink
                to="/admin"
                className={({ isActive }) => (isActive ? 'nav-link activo' : 'nav-link')}
              >
                Zona Admin (RBAC)
              </NavLink>
            </>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) => (isActive ? 'nav-link activo' : 'nav-link')}
            >
              Iniciar Sesión
            </NavLink>
          )}
        </nav>

        <div className="navbar-actions">
          {estaAutenticado && usuario ? (
            <div className="usuario-info-nav">
              {usuario.image ? (
                <img
                  src={usuario.image}
                  alt={usuario.username}
                  className="usuario-avatar-nav"
                />
              ) : (
                <div className="usuario-avatar-placeholder">
                  {usuario.firstName.charAt(0)}
                </div>
              )}
              <div className="usuario-detalles-nav">
                <span className="usuario-nombre">
                  {usuario.firstName} {usuario.lastName}
                </span>
                <span className="usuario-rol-badge">
                  {usuario.roles.join(', ') || 'USER'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCerrarSesion}
                className="boton-logout"
              >
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <span className="badge-sesion-inactiva">Sesión Desconectada</span>
          )}
        </div>
      </div>
    </header>
  );
};

