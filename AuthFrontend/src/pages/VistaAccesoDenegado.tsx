import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const VistaAccesoDenegado: React.FC = () => {
  const { usuario } = useAuth();

  return (
    <div className="contenedor-acceso-denegado">
      <div className="tarjeta-denegado">
        <span className="codigo-error-http">403 Forbidden</span>
        <h2 className="titulo-denegado">Acceso Restringido por Rol</h2>
        <p className="mensaje-denegado">
          Tu usuario actual (<strong>{usuario?.username || 'Invitado'}</strong>) tiene asignados los roles:{' '}
          <code>{usuario?.roles.join(', ') || 'Ninguno'}</code>.
          Esta vista requiere privilegios adicionales de administrador.
        </p>

        <div className="bloque-explicativo-denegado">
          <p>
            Esta redirección preventiva la ejecuta el componente <code>&lt;RutaProtegida /&gt;</code> al
            detectar que tus afirmaciones (claims) de rol no coinciden con la lista permitida para esta ruta.
          </p>
        </div>

        <div className="acciones-denegado">
          <Link to="/panel" className="boton-primario">
            Regresar al Panel Principal
          </Link>
        </div>
      </div>
    </div>
  );
};

