import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import { PerfilUsuario, JwtPayloadUsuario } from '../types/auth';
import { decodificarToken, estaTokenExpirado } from '../utils/jwt';
import { ElementoSeguroPorRol } from '../components/ElementoSeguroPorRol';

export const PanelGeneral: React.FC = () => {
  const { usuario, token, corromperAccessTokenParaPrueba } = useAuth();
  const [perfilData, setPerfilData] = useState<PerfilUsuario | null>(null);
  const [cargandoPerfil, setCargandoPerfil] = useState(false);
  const [errorPerfil, setErrorPerfil] = useState<string | null>(null);
  const [registroAcciones, setRegistroAcciones] = useState<string[]>([]);

  const registrarEvento = (mensaje: string) => {
    const hora = new Date().toLocaleTimeString();
    setRegistroAcciones((prev) => [`[${hora}] ${mensaje}`, ...prev.slice(0, 7)]);
  };

  const handleVerPerfil = async () => {
    setErrorPerfil(null);
    setCargandoPerfil(true);
    registrarEvento('Enviando GET /auth/me a través de clienteApi con interceptor...');

    try {
      const data = await authService.obtenerPerfil();
      setPerfilData(data);
      registrarEvento('Respuesta 200 OK recibida: Perfil obtenido exitosamente.');
    } catch (err: unknown) {
      const mensaje = err instanceof Error ? err.message : 'Error al obtener perfil';
      setErrorPerfil(mensaje);
      registrarEvento(`Fallo en la petición: ${mensaje}`);
    } finally {
      setCargandoPerfil(false);
    }
  };

  const handleSimularExpiracion = () => {
    corromperAccessTokenParaPrueba();
    registrarEvento(
      'Token de acceso invalidado intencionalmente en localStorage. La próxima petición disparará un 401 y el interceptor ejecutará la renovación automática con el refresh token.'
    );
  };

  const claimsToken: JwtPayloadUsuario | null = token ? decodificarToken(token) : null;
  const expirado = token ? estaTokenExpirado(token) : true;

  return (
    <div className="contenedor-panel">
      <div className="tarjeta-resumen-usuario">
        <div className="fila-usuario-principal">
          {usuario?.image && (
            <img
              src={usuario.image}
              alt={usuario.username}
              className="avatar-grande"
            />
          )}
          <div className="info-texto-usuario">
            <h1 className="nombre-bienvenida">
              Bienvenido, {usuario?.firstName} {usuario?.lastName}
            </h1>
            <p className="correo-usuario">{usuario?.email}</p>
            <div className="roles-tags">
              <span className="etiqueta-rol-titulo">Roles asignados:</span>
              {usuario?.roles.map((rol) => (
                <span key={rol} className="badge-rol">
                  {rol}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="cuadricula-dos-columnas">
        {/* Columna 1: Estado del Token y Demostración de Refresco */}
        <div className="tarjeta-seccion">
          <div className="cabecera-seccion">
            <h3 className="titulo-seccion">Estado del Token y Renovación Silenciosa</h3>
            <span className={`badge-estado ${expirado ? 'estado-alerta' : 'estado-valido'}`}>
              {expirado ? 'Token Caducado / Inválido' : 'Token Activo'}
            </span>
          </div>

          <div className="detalles-token">
            <p className="descripcion-corta">
              El cliente administra el token JWT de acceso y lo inyecta automáticamente en cada
              cabecera mediante el interceptor de Axios.
            </p>

            <div className="bloque-token-info">
              <div className="item-token-dato">
                <strong>Access Token actual:</strong>
                <code className="codigo-recortado">
                  {token ? `${token.substring(0, 30)}...${token.slice(-15)}` : 'Sin token'}
                </code>
              </div>

              {claimsToken?.exp && (
                <div className="item-token-dato">
                  <strong>Expira en (UNIX):</strong>
                  <span>{new Date(claimsToken.exp * 1000).toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="acciones-pruebas-token">
              <button
                type="button"
                className="boton-alerta"
                onClick={handleSimularExpiracion}
              >
                Simular Expiración de Access Token
              </button>

              <button
                type="button"
                className="boton-primario"
                onClick={handleVerPerfil}
                disabled={cargandoPerfil}
              >
                {cargandoPerfil ? 'Consultando /auth/me...' : 'Ver Perfil (GET /auth/me)'}
              </button>
            </div>
          </div>

          {/* Registro de eventos de red e interceptores */}
          <div className="registro-consola">
            <div className="registro-cabecera">
              <span>Registro de eventos de red e interceptores</span>
            </div>
            <div className="registro-lista">
              {registroAcciones.length === 0 ? (
                <p className="registro-vacio">Presiona "Ver Perfil" o "Simular Expiración" para observar los interceptores.</p>
              ) : (
                registroAcciones.map((log, index) => (
                  <div key={index} className="linea-registro">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Columna 2: Resultado de /auth/me y Navegación Protegida */}
        <div className="tarjeta-seccion">
          <div className="cabecera-seccion">
            <h3 className="titulo-seccion">Datos Obtenidos de /auth/me</h3>
          </div>

          {errorPerfil && (
            <div className="alerta-error">
              {errorPerfil}
            </div>
          )}

          {perfilData ? (
            <div className="ficha-perfil-obtenido">
              <div className="fila-detalle-perfil">
                <span className="clave-perfil">ID en Backend:</span>
                <span className="valor-perfil">{perfilData.id}</span>
              </div>
              <div className="fila-detalle-perfil">
                <span className="clave-perfil">Nombre Completo:</span>
                <span className="valor-perfil">{perfilData.firstName} {perfilData.lastName}</span>
              </div>
              <div className="fila-detalle-perfil">
                <span className="clave-perfil">Usuario:</span>
                <span className="valor-perfil">{perfilData.username}</span>
              </div>
              <div className="fila-detalle-perfil">
                <span className="clave-perfil">Email:</span>
                <span className="valor-perfil">{perfilData.email}</span>
              </div>
              <div className="fila-detalle-perfil">
                <span className="clave-perfil">Rol del Servidor:</span>
                <span className="valor-perfil">{perfilData.role || 'No especificado'}</span>
              </div>
              {perfilData.phone && (
                <div className="fila-detalle-perfil">
                  <span className="clave-perfil">Teléfono:</span>
                  <span className="valor-perfil">{perfilData.phone}</span>
                </div>
              )}
              {perfilData.company && (
                <div className="fila-detalle-perfil">
                  <span className="clave-perfil">Empresa:</span>
                  <span className="valor-perfil">{perfilData.company.name} ({perfilData.company.title})</span>
                </div>
              )}
            </div>
          ) : (
            <div className="tarjeta-vacia">
              <p>Haz clic en <strong>"Ver Perfil (GET /auth/me)"</strong> para solicitar al servidor la identidad verificada.</p>
            </div>
          )}

          <div className="seccion-rutas-demostracion">
            <h4 className="subtitulo-seccion">Rutas Protegidas Disponibles</h4>
            <div className="lista-rutas-enlaces">
              <Link to="/perfil" className="enlace-ruta-item">
                <div className="info-enlace-ruta">
                  <strong>Ruta: /perfil</strong>
                  <span>Vista protegida que autoejecuta la consulta al montar</span>
                </div>
                <span className="flecha-enlace">Ir</span>
              </Link>

              <Link to="/admin" className="enlace-ruta-item">
                <div className="info-enlace-ruta">
                  <strong>Ruta: /admin (RBAC)</strong>
                  <span>Protegida para rol ADMIN. Los usuarios estándar son denegados</span>
                </div>
                <span className="flecha-enlace">Ir</span>
              </Link>
            </div>

            {/* Demostración de RBAC a nivel componente */}
            <ElementoSeguroPorRol rolesRequeridos={['ADMIN']}>
              <div className="bloque-admin-granular">
                <span className="insignia-rbac">Elemento granular RBAC</span>
                <p>Este bloque solo es visible en el DOM para operadores con rol ADMIN.</p>
              </div>
            </ElementoSeguroPorRol>
          </div>
        </div>
      </div>
    </div>
  );
};

