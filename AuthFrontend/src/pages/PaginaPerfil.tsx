import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/api';
import { PerfilUsuario } from '../types/auth';

export const PaginaPerfil: React.FC = () => {
  const [perfil, setPerfil] = useState<PerfilUsuario | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarDatosPerfil = async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await authService.obtenerPerfil();
      setPerfil(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('No fue posible cargar el perfil desde el servidor.');
      }
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatosPerfil();
  }, []);

  return (
    <div className="contenedor-pagina-perfil">
      <div className="cabecera-pagina">
        <div>
          <h2 className="titulo-principal">Perfil Verificado del Servidor</h2>
          <p className="subtitulo-pagina">
            Ruta protegida por <code>&lt;RutaProtegida /&gt;</code> que consulta <code>GET /auth/me</code>.
          </p>
        </div>
        <Link to="/panel" className="boton-secundario">
          Volver al Panel
        </Link>
      </div>

      {cargando && (
        <div className="caja-estado-carga">
          <div className="spinner"></div>
          <p>Consultando identidad verificada en DummyJSON...</p>
        </div>
      )}

      {error && (
        <div className="alerta-error">
          <p><strong>Error de autorización:</strong> {error}</p>
          <button type="button" className="boton-secundario" onClick={cargarDatosPerfil}>
            Reintentar Consulta
          </button>
        </div>
      )}

      {perfil && !cargando && (
        <div className="tarjeta-perfil-completo">
          <div className="encabezado-perfil-tarjeta">
            <img src={perfil.image} alt={perfil.username} className="avatar-perfil-completo" />
            <div className="datos-titulares">
              <h3>{perfil.firstName} {perfil.lastName}</h3>
              <p className="texto-username">@{perfil.username}</p>
              <span className="badge-rol">{perfil.role?.toUpperCase() || 'USER'}</span>
            </div>
          </div>

          <div className="grilla-detalles">
            <div className="campo-detalle">
              <span className="etiqueta-detalle">Correo Electrónico</span>
              <span className="valor-detalle">{perfil.email}</span>
            </div>
            <div className="campo-detalle">
              <span className="etiqueta-detalle">Teléfono</span>
              <span className="valor-detalle">{perfil.phone || 'No registrado'}</span>
            </div>
            <div className="campo-detalle">
              <span className="etiqueta-detalle">Fecha de Nacimiento</span>
              <span className="valor-detalle">{perfil.birthDate || 'No registrada'}</span>
            </div>
            <div className="campo-detalle">
              <span className="etiqueta-detalle">Género</span>
              <span className="valor-detalle">{perfil.gender}</span>
            </div>
            {perfil.company && (
              <>
                <div className="campo-detalle">
                  <span className="etiqueta-detalle">Empresa</span>
                  <span className="valor-detalle">{perfil.company.name}</span>
                </div>
                <div className="campo-detalle">
                  <span className="etiqueta-detalle">Cargo</span>
                  <span className="valor-detalle">{perfil.company.title}</span>
                </div>
              </>
            )}
          </div>

          <div className="pie-tarjeta-perfil">
            <button type="button" className="boton-primario" onClick={cargarDatosPerfil}>
              Refrescar Datos del Perfil
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

