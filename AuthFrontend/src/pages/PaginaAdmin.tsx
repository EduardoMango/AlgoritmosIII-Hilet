import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const PaginaAdmin: React.FC = () => {
  const { usuario } = useAuth();

  return (
    <div className="contenedor-admin">
      <div className="cabecera-pagina">
        <div>
          <h2 className="titulo-principal">Módulo de Administración (RBAC)</h2>
          <p className="subtitulo-pagina">
            Ruta protegida con guarda de rol: <code>rolesPermitidos={['ADMIN']}</code>
          </p>
        </div>
        <Link to="/panel" className="boton-secundario">
          Volver al Panel
        </Link>
      </div>

      <div className="tarjeta-admin-info">
        <div className="banner-autorizacion-exitosa">
          <strong>Acceso Autorizado:</strong> Tienes el rol <code>ADMIN</code> activo en tu sesión ({usuario?.username}).
        </div>

        <h3 className="titulo-seccion-admin">Concepto de RBAC en el Frontend (Bloque 6.2)</h3>
        <p className="parrafo-explicativo">
          El control de acceso basado en roles regula la visualización de rutas completas y elementos
          específicos. Sin embargo, como resalta el apunte didáctico, las guardas en el enrutador
          constituyen exclusivamente <strong>mecanismos de UX</strong> para evitar interacciones infructuosas.
          La seguridad real siempre reside en la verificación que el backend efectúa sobre el token JWT en cada llamada.
        </p>

        <div className="estadisticas-admin-grid">
          <div className="tarjeta-stat">
            <span className="stat-numero">200 OK</span>
            <span className="stat-label">Autorización Cliente</span>
          </div>
          <div className="tarjeta-stat">
            <span className="stat-numero">JWT</span>
            <span className="stat-label">Claims Inspeccionadas</span>
          </div>
          <div className="tarjeta-stat">
            <span className="stat-numero">RFC 7519</span>
            <span className="stat-label">Estándar de Token</span>
          </div>
        </div>
      </div>
    </div>
  );
};

