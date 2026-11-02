import React, { useState, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';

interface EstadoUbicacion {
  from?: {
    pathname: string;
    search: string;
  };
}

export const PaginaLogin: React.FC = () => {
  const [username, setUsername] = useState('emilys');
  const [password, setPassword] = useState('emilyspass');
  const [cargando, setCargando] = useState(false);
  const [errorLogin, setErrorLogin] = useState<string | null>(null);

  const { iniciarSesion } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Extracción tipada de la ruta de origen preservada en el guardián
  const estado = location.state as EstadoUbicacion | undefined;
  const destinoPostLogin = estado?.from
    ? `${estado.from.pathname}${estado.from.search}`
    : '/panel';

  const manejarEnvio = async (e: FormEvent) => {
    e.preventDefault();
    setErrorLogin(null);
    setCargando(true);

    // Ajuste de conveniencia: si el usuario escribe emilyspassword o michaelwpassword, normalizar al formato de DummyJSON (emilyspass)
    let contrasenaEnvio = password.trim();
    const usuarioLimpio = username.trim().toLowerCase();
    if (contrasenaEnvio.endsWith('password') && (usuarioLimpio === 'emilys' || usuarioLimpio === 'michaelw' || usuarioLimpio === 'averyp')) {
      contrasenaEnvio = contrasenaEnvio.replace(/password$/, 'pass');
    }

    try {
      // Petición al endpoint oficial de login de DummyJSON
      const respuesta = await authService.login(usuarioLimpio, contrasenaEnvio);
      iniciarSesion(respuesta);

      // Redirección hacia la ruta de origen solicitada originalmente
      navigate(destinoPostLogin, { replace: true });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorLogin(err.message || 'Credenciales de acceso no válidas.');
      } else {
        setErrorLogin('Ocurrió un error inesperado al autenticar.');
      }
    } finally {
      setCargando(false);
    }
  };

  const cargarCredenciales = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    setErrorLogin(null);
  };

  return (
    <div className="contenedor-login">
      <div className="tarjeta-login">
        <div className="cabecera-login">
          <h2 className="titulo-login">Iniciar Sesión</h2>
          <p className="subtitulo-login">
            Autenticación JWT con rotación de Refresh Token vía DummyJSON
          </p>
          {estado?.from && (
            <div className="alerta-redireccion">
              Intentaste acceder a <code>{estado.from.pathname}</code>. Inicia sesión para continuar.
            </div>
          )}
        </div>

        {errorLogin && (
          <div className="alerta-error" role="alert">
            {errorLogin}
          </div>
        )}

        <form onSubmit={manejarEnvio} className="formulario-login">
          <div className="campo-formulario">
            <label htmlFor="campo-username">Usuario (DummyJSON):</label>
            <input
              id="campo-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ej. emilys"
              required
              disabled={cargando}
            />
          </div>

          <div className="campo-formulario">
            <label htmlFor="campo-password">Contraseña:</label>
            <input
              id="campo-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={cargando}
            />
          </div>

          <button
            type="submit"
            className="boton-primario ancho-completo"
            disabled={cargando}
          >
            {cargando ? 'Validando Credenciales...' : 'Ingresar al Sistema'}
          </button>
        </form>

        <div className="seccion-credenciales-demo">
          <span className="etiqueta-demo">Cuentas de prueba rápidas:</span>
          <div className="botones-demo-grupo">
            <button
              type="button"
              className="boton-secundario boton-pequeno"
              onClick={() => cargarCredenciales('emilys', 'emilyspass')}
            >
              Emily Johnson (Admin - Acceso total)
            </button>
            <button
              type="button"
              className="boton-secundario boton-pequeno"
              onClick={() => cargarCredenciales('averyp', 'averyppass')}
            >
              Avery Perez (Usuario Estándar - RBAC 403 en /admin)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

