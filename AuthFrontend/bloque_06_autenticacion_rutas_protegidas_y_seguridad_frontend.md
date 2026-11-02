# Bloque 6: Autenticación, Rutas Protegidas y Seguridad en el Frontend

> [!NOTE]
> **Carga Horaria:** 2 horas (Clase 6)  
> **Objetivo Didáctico:** Integrar flujos de autenticación basados en JSON Web Tokens (JWT) mediante Context API, implementar guardas de navegación en React Router y aplicar principios de defensa en profundidad para proteger el estado y la comunicación en el cliente.

---

## 6.1. Flujo de Autenticación con JWT en Single Page Applications

La administración de identidad en aplicaciones de página única demanda articular una experiencia de usuario fluida sobre un protocolo de comunicación intrínsecamente sin estado (*stateless*). En este escenario, la aplicación web debe coordinar la recepción de credenciales emitidas por el servidor, la sincronización de la memoria reactiva y la persistencia de sesión a lo largo de las recargas del navegador sin comprometer la seguridad ni la consistencia visual.

### Delimitación de Responsabilidades: Frontend vs. Backend

En arquitecturas desacopladas donde el cliente se ejecuta de forma independiente al servidor, el protocolo de autenticación sin estado (*stateless authentication*) basado en JSON Web Tokens (RFC 7519) representa el estándar predominante en la industria del software. A diferencia de las aplicaciones monolíticas tradicionales basadas en sesiones del lado del servidor persistidas en memoria o almacenamiento compartido (como Redis), una Single Page Application (SPA) asume el rol de receptora, administradora y transmisora de credenciales temporales.

Desde la perspectiva del frontend, el token de acceso recibido tras el inicio de sesión se trata como una credencial opaca portadora de afirmaciones (*claims*). El cliente debe delimitar con absoluta rigurosidad sus responsabilidades frente a dicho token:

1. **Inspección de Afirmaciones Públicas en el Cliente:** La aplicación de React decodifica el token con el único fin de sincronizar el estado visual de la interfaz. Esto incluye mostrar el nombre del perfil, habilitar menús según los roles del usuario (`roles`) y evaluar si el token ha expirado (`exp`) antes de despachar una petición costosa a la red.
2. **Validación Criptográfica Exclusiva del Backend:** El frontend carece deliberadamente de la clave secreta o privada requerida para comprobar la firma digital del token. Cualquier afirmación leída en el navegador se considera no verificada en términos de seguridad. La autenticidad e integridad del token son auditadas exclusivamente por los *middlewares* del servidor en cada petición entrante.

> [!WARNING]
> Un token JWT estándar no está cifrado, sino codificado en Base64Url. Cualquier usuario o script con acceso a la cadena puede decodificarla y leer su contenido en texto plano. Queda estrictamente prohibido almacenar contraseñas, secretos de API o información sensible confidencial dentro de las afirmaciones del token.

---

### Decodificación de Tokens en el Cliente: Uso de Bibliotecas Estándar

Para inspeccionar las afirmaciones del token en el navegador, el ecosistema de JavaScript cuenta con funciones nativas como `atob()`. Sin embargo, el análisis manual mediante primitivas del navegador es una fuente constante de fallos en entornos de producción:
* `atob()` no procesa correctamente secuencias con caracteres especiales o acentos en formato UTF-8, generando errores de decodificación.
* Los tokens JWT omiten el relleno (*padding*) convencional de Base64, lo que exige manipulaciones manuales propensas a errores.
* Carece de integración directa con el sistema de tipos de TypeScript.

Por estos motivos, la convención estándar en la industria consiste en utilizar bibliotecas especializadas, consolidadas y de mínimo impacto en el empaquetado, siendo **`jwt-decode`** la referencia indiscutida en aplicaciones React. Se trata de un módulo ultraliviano (menos de 1 KB empaquetado), libre de dependencias externas y diseñado específicamente para extraer el payload tipado en el navegador:

```bash
# Instalación de la biblioteca estándar en el proyecto
npm install jwt-decode
```

A continuación se modela la extracción segura y tipada de las afirmaciones de sesión:

```typescript
import { jwtDecode } from 'jwt-decode';

// Modelo formal de las afirmaciones públicas extraídas del token
export interface JwtPayloadUsuario {
  sub: string;             // Identificador único del usuario (UUID)
  email: string;           // Correo electrónico principal
  nombre: string;          // Nombre para presentación en pantalla
  roles: string[];         // Colección de roles asignados
  exp: number;             // Marca temporal de expiración (UNIX timestamp en segundos)
  iat?: number;            // Marca temporal de emisión
}

// Función de utilidad para decodificar e inferir tipos de forma segura
export function decodificarToken(token: string): JwtPayloadUsuario | null {
  try {
    return jwtDecode<JwtPayloadUsuario>(token);
  } catch (error) {
    console.error('El token suministrado no posee un formato JWT válido:', error);
    return null;
  }
}
```

---

### Ciclo de Vida de la Sesión de Usuario

El ciclo de vida de la sesión en el cliente abarca tres transiciones operativas fundamentales: autenticación inicial (*Login*), persistencia con hidratación (*Session Rehydration*) y terminación controlada (*Logout*).

```
CICLO DE VIDA DE LA SESIÓN EN EL CLIENTE

[Credenciales: POST /api/auth/login]
                 │
                 ▼
[Respuesta 200 OK: { accessToken }]
                 │
                 ▼
[Almacenamiento y Propagación en Estado React] ──► [Consumo en Vistas y Clientes HTTP]
                 │
                 ▼
[Acción de Cierre o Error 401]
                 │
                 ▼
[Purga de Almacenamiento + Reseteo de Estado] ──► [Redirección Forzada a /login]
```

#### Flujo de Inicio de Sesión (*Login*)
1. El usuario somete sus credenciales (usuario y contraseña) a través de un formulario controlado en el cliente.
2. La aplicación despacha una petición asíncrona mediante el método HTTP `POST` hacia el endpoint de autenticación del backend (ej. `/api/v1/auth/login`).
3. Al verificar las credenciales, el backend genera y retorna un token de acceso (*Access Token*) en el cuerpo de la respuesta JSON (o en una cookie segura).
4. El cliente captura el token, decodifica sus afirmaciones públicas para extraer la identidad mínima del usuario y sincroniza el estado global de autenticación en la memoria reactiva.
5. Opcionalmente, se ejecuta una estrategia de persistencia para habilitar la continuidad de sesión ante recargas del navegador.

#### Flujo de Cierre de Sesión (*Logout*)
1. El usuario activa deliberadamente la opción de salir, o bien el cliente HTTP detecta una respuesta de sesión vencida (código HTTP 401).
2. Se destruye cualquier referencia del token de acceso presente en la memoria reactiva y en el almacenamiento del navegador (`localStorage`, `sessionStorage`).
3. Se restablecen las variables del estado global a sus valores iniciales neutros (`user: null`, `isAuthenticated: false`).
4. Se ejecuta una navegación programática forzada hacia la pantalla de acceso (`/login`), invalidando simultáneamente cualquier dato en caché del usuario saliente para prevenir la fuga de información entre sesiones.

---

### Manejo de Sesión Global con `AuthContext`

Debido a que el estado de autenticación condiciona la visibilidad de componentes transversales (como barras de navegación, menús laterales y módulos protegidos), su gestión no puede residir en un componente aislado. La solución estándar en React consiste en modelar un contexto global mediante **Context API**, encapsulando la lógica en un proveedor dedicado y exponiendo su acceso mediante un Hook personalizado.

#### El Desafío del Parpadeo de Navegación (*Flash of Unauthenticated Content*)
Un error común en la implementación de autenticación en SPAs radica en inicializar el estado reactivo con valores síncronos por defecto (`isAuthenticated = false` y `user = null`). Al recargar la página en una ruta protegida (como `/panel-control`), el enrutador evalúa dicho estado inicial falso antes de que los efectos asíncronos (`useEffect`) finalicen la lectura del almacenamiento persistente.

Como resultado, la aplicación redirige al usuario hacia `/login` de forma errónea, para luego devolverlo a la vista protegida una vez leída la credencial. Este fenómeno de renderizado inconsistente se conoce como parpadeo de navegación o *Flash of Unauthenticated Content* (FOUC).

Para neutralizar este defecto, el modelo de estado debe incorporar obligatoriamente una bandera de carga de autenticación: `isLoadingAuth`. Mientras esta bandera permanezca activa en `true`, la jerarquía de rutas suspende la evaluación de guardas y renderiza un componente neutro de carga (*Spinner* o pantalla en blanco), impidiendo transiciones prematuras.

```typescript
// Tipado formal del contexto de autenticación
export interface UsuarioSesion {
  id: string;
  email: string;
  nombre: string;
  roles: string[];
}

export interface AuthContextType {
  usuario: UsuarioSesion | null;
  token: string | null;
  estaAutenticado: boolean;
  cargandoAutenticacion: boolean;
  iniciarSesion: (tokenAcceso: string) => void;
  cerrarSesion: () => void;
}
```

```tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { decodificarToken } from '../utils/jwt';

const CLAVE_TOKEN_STORAGE = 'auth_access_token';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<UsuarioSesion | null>(null);
  const [cargandoAutenticacion, setCargandoAutenticacion] = useState<boolean>(true);

  // Sincronización e hidratación durante el montaje inicial
  useEffect(() => {
    const restaurarSesion = () => {
      try {
        const tokenPersistido = localStorage.getItem(CLAVE_TOKEN_STORAGE);
        if (tokenPersistido) {
          const payload = decodificarToken(tokenPersistido);
          const marcaActual = Math.floor(Date.now() / 1000);

          // Verificación preventiva de expiración temporal del token
          if (payload && payload.exp > marcaActual) {
            setToken(tokenPersistido);
            setUsuario({
              id: payload.sub,
              email: payload.email,
              nombre: payload.nombre,
              roles: payload.roles || []
            });
          } else {
            // El token expiró en el disco local: se remueve
            localStorage.removeItem(CLAVE_TOKEN_STORAGE);
          }
        }
      } catch (error) {
        console.error('Error al restaurar sesión previa:', error);
        localStorage.removeItem(CLAVE_TOKEN_STORAGE);
      } finally {
        setCargandoAutenticacion(false);
      }
    };

    restaurarSesion();
  }, []);

  const iniciarSesion = (nuevoToken: string) => {
    const payload = decodificarToken(nuevoToken);
    if (!payload) {
      throw new Error('Token JWT provisto posee una estructura inválida.');
    }

    localStorage.setItem(CLAVE_TOKEN_STORAGE, nuevoToken);
    setToken(nuevoToken);
    setUsuario({
      id: payload.sub,
      email: payload.email,
      nombre: payload.nombre,
      roles: payload.roles || []
    });
  };

  const cerrarSesion = () => {
    localStorage.removeItem(CLAVE_TOKEN_STORAGE);
    setToken(null);
    setUsuario(null);
  };

  const valorContexto: AuthContextType = {
    usuario,
    token,
    estaAutenticado: token !== null && usuario !== null,
    cargandoAutenticacion,
    iniciarSesion,
    cerrarSesion
  };

  return (
    <AuthContext.Provider value={valorContexto}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook de consumo encapsulado con salvaguarda estructural
export const useAuth = (): AuthContextType => {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error('useAuth debe ser consumido estrictamente dentro de un AuthProvider.');
  }
  return contexto;
};
```

---

## 6.2. Protección de Rutas y Control de Acceso (React Router)

Una vez centralizada la identidad en el estado global, el sistema de enrutamiento asume la función de coordinar la navegación en función del nivel de autorización del usuario. En aplicaciones frontend modernas, la gestión de rutas no solo previene la renderización de pantallas no autorizadas, sino que también preserva la intención de navegación del usuario y adapta la experiencia según las responsabilidades asignadas en el sistema.

### Patrón de Componente Guardián (`<RutaProtegida>`)

En React Router (versiones 6 y superiores), la estrategia canónica para restringir el acceso a ramas enteras de navegación consiste en el uso de componentes de diseño (*layout routes*) que actúan como guardianes de seguridad en el cliente.

El componente guardián inspecciona el estado de autenticación antes de conceder la renderización de las rutas anidadas. Si el usuario no ha completado el inicio de sesión, el guardián interrumpe el ciclo normal y emite una redirección declarativa mediante el componente `<Navigate />`.

```
EVALUACIÓN DE ACCESO EN COMPONENTE GUARDIÁN

                   [Petición de Navegación: /panel]
                                  │
                                  ▼
                   ¿cargandoAutenticacion === true?
                       ├─── SÍ ──► [Renderizar Pantalla de Carga]
                       └─── NO
                             │
                             ▼
                   ¿estaAutenticado === true?
                       ├─── SÍ ──► [Renderizar <Outlet /> (Vista Hija)]
                       └─── NO ──► [<Navigate to="/login" replace state={{ from }} />]
```

Para asegurar una navegación coherente y fluida, la redirección debe configurar dos atributos fundamentales:
1. `replace`: Sustituye la entrada actual en la pila del historial del navegador en lugar de empujar una nueva. Esto previene que el botón "Atrás" del navegador genere un bucle infinito que retorne al usuario a la ruta protegida que acaba de rechazarlo.
2. `state={{ from: location }}`: Embebe la ubicación actual (`Location`) que el usuario intentaba visitar dentro del estado de navegación para su posterior recuperación.

```tsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface RutaProtegidaProps {
  rolesPermitidos?: string[];
}

export const RutaProtegida: React.FC<RutaProtegidaProps> = ({ rolesPermitidos }) => {
  const { estaAutenticado, cargandoAutenticacion, usuario } = useAuth();
  const location = useLocation();

  // 1. Suspensión de evaluación mientras se hidrata la sesión
  if (cargandoAutenticacion) {
    return (
      <div className="indicador-carga-pantalla">
        <p>Verificando credenciales de sesión...</p>
      </div>
    );
  }

  // 2. Redirección si no existe sesión válida
  if (!estaAutenticado) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Verificación de privilegios basada en roles (RBAC)
  if (rolesPermitidos && rolesPermitidos.length > 0) {
    const tieneRolRequerido = usuario?.roles.some((rol) =>
      rolesPermitidos.includes(rol)
    );

    if (!tieneRolRequerido) {
      // Redirección a pantalla de acceso denegado si carece de rol suficiente
      return <Navigate to="/acceso-denegado" replace />;
    }
  }

  // 4. Renderizado seguro del recurso secundario
  return <Outlet />;
};
```

---

### Restauración de Navegación Post-Login

Cuando un usuario no autenticado intenta acceder a un enlace directo y protegido (por ejemplo, `/informes/ventas/2026`), resulta lesivo para la experiencia de usuario redirigirlo a un panel de control general tras completar el inicio de sesión. La aplicación debe restituir el flujo de navegación guiándolo al recurso inicialmente solicitado.

Este comportamiento se logra capturando el objeto de historial provisto en `location.state?.from` dentro del componente del formulario de inicio de sesión:

```tsx
import React, { useState, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface EstadoUbicacion {
  from?: {
    pathname: string;
    search: string;
  };
}

export const PaginaLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

    try {
      // Despacho de credenciales al backend
      const respuesta = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!respuesta.ok) {
        throw new Error('Credenciales de acceso no válidas.');
      }

      const datos = await respuesta.json();
      iniciarSesion(datos.accessToken);

      // Redirección hacia la ruta de origen solicitada originalmente
      navigate(destinoPostLogin, { replace: true });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorLogin(err.message);
      } else {
        setErrorLogin('Ocurrió un error inesperado al autenticar.');
      }
    }
  };

  return (
    <div className="formulario-login-contenedor">
      <h2>Inicio de Sesión Corporativo</h2>
      {errorLogin && <div className="alerta-error">{errorLogin}</div>}
      <form onSubmit={manejarEnvio}>
        <label htmlFor="campo-email">Correo Electrónico:</label>
        <input
          id="campo-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="campo-password">Contraseña:</label>
        <input
          id="campo-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Ingresar al Sistema</button>
      </form>
    </div>
  );
};
```

---

### Protección Inversa de Rutas Públicas

Un usuario con una sesión válida activa no debe tener acceso a vistas transaccionales de ingreso o registro (`/login`, `/registro`). Si un operador autenticado navega voluntariamente hacia `/login`, la aplicación debe interceptar la acción y reenviarlo hacia su espacio de trabajo predeterminado.

Para este propósito se implementa un componente guardián inverso:

```tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const RutaPublicaExclusiva: React.FC = () => {
  const { estaAutenticado, cargandoAutenticacion } = useAuth();

  if (cargandoAutenticacion) {
    return null; // Omitir renderizado transitorio durante hidratación
  }

  // Si ya posee una sesión activa, se redirige al panel principal
  if (estaAutenticado) {
    return <Navigate to="/panel" replace />;
  }

  return <Outlet />;
};
```

---

### Control de Acceso Basado en Roles (RBAC Básico)

El control de acceso basado en roles (*Role-Based Access Control* o RBAC) regula los permisos de visualización y ejecución en función de las responsabilidades asignadas al usuario en el sistema. En el frontend, este patrón se despliega en dos niveles arquitectónicos:

1. **Nivel Macroscópico (Rutas):** Restricción de pantallas completas mediante la propiedad `rolesPermitidos` en las rutas vigiladas por el guardián.
2. **Nivel Microscópico (Componentes y Acciones):** Supresión u ocultamiento de botones de acción, menús o paneles específicos dentro de una vista compartida.

```tsx
interface ElementoSeguroPorRolProps {
  rolesRequeridos: string[];
  children: React.ReactNode;
}

// Componente granular para autorización en el árbol visual
export const ElementoSeguroPorRol: React.FC<ElementoSeguroPorRolProps> = ({
  rolesRequeridos,
  children
}) => {
  const { usuario } = useAuth();

  if (!usuario) {
    return null;
  }

  const tienePermiso = usuario.roles.some((rol) => rolesRequeridos.includes(rol));

  if (!tienePermiso) {
    return null;
  }

  return <>{children}</>;
};
```

La siguiente configuración integra ambos guardianes en el enrutador central de la aplicación:

```tsx
import { Routes, Route } from 'react-router-dom';
import { RutaProtegida } from './components/RutaProtegida';
import { RutaPublicaExclusiva } from './components/RutaPublicaExclusiva';
import { PaginaLogin } from './pages/PaginaLogin';
import { PanelGeneral } from './pages/PanelGeneral';
import { ModuloAuditoria } from './pages/ModuloAuditoria';
import { VistaAccesoDenegado } from './pages/VistaAccesoDenegado';

export const EnrutadorApp: React.FC = () => {
  return (
    <Routes>
      {/* Rutas exclusivas para usuarios sin autenticar */}
      <Route element={<RutaPublicaExclusiva />}>
        <Route path="/login" element={<PaginaLogin />} />
      </Route>

      {/* Rutas operativas protegidas para cualquier usuario autenticado */}
      <Route element={<RutaProtegida />}>
        <Route path="/panel" element={<PanelGeneral />} />
      </Route>

      {/* Rutas con restricción RBAC: solo administradores y auditores */}
      <Route element={<RutaProtegida rolesPermitidos={['ADMIN', 'AUDITOR']} />}>
        <Route path="/auditoria" element={<ModuloAuditoria />} />
      </Route>

      {/* Rutas públicas informativas de fallback */}
      <Route path="/acceso-denegado" element={<VistaAccesoDenegado />} />
    </Routes>
  );
};
```

---

## 6.3. Almacenamiento Seguro de Tokens y Mitigación de Vulnerabilidades

La ejecución de código en el navegador web sitúa al frontend en un entorno expuesto a diversas amenazas de seguridad informática. Garantizar la confidencialidad e integridad de las credenciales requiere evaluar los vectores de ataque predominantes en la web, seleccionar mecanismos de almacenamiento con base en un análisis riguroso de compromisos (*trade-offs*) y configurar clientes HTTP capaces de gestionar autorizaciones de forma centralizada y resistente.

### Estrategias de Almacenamiento y Vectores de Ataque

La selección del medio de almacenamiento para credenciales en una SPA constituye una decisión de compromiso (*trade-off*) entre persistencia, conveniencia técnica y resistencia ante vectores de ataque web. No existe un mecanismo perfecto en el cliente; cada alternativa presenta vulnerabilidades intrínsecas que deben mitigarse mediante defensas específicas.

```
VECTORES DE AMENAZA WEB EN ARQUITECTURAS SPA

1. Cross-Site Scripting (XSS)
   [Script Malicioso Inyectado] ──► Accede a window.localStorage ──► Exfiltra Token
   * Vulnerable: localStorage / sessionStorage
   * Mitigación: Sanitización estricta y Cookies HttpOnly

2. Cross-Site Request Forgery (CSRF)
   [Sitio Web Atacante] ──► Dispara petición a la API ──► Navegador adjunta Cookie HttpOnly
   * Vulnerable: Cookies sin banderas de aislamiento
   * Mitigación: Banderas SameSite=Strict/Lax y cabeceras personalizadas
```

#### 1. Web Storage (`localStorage` / `sessionStorage`)
* **Mecánica:** Los tokens se almacenan como cadenas de texto en el espacio de almacenamiento del navegador del origen respectivo.
* **Vector de Ataque Primario (XSS):** Cualquier código JavaScript que se ejecute en el contexto de la aplicación tiene acceso de lectura irrestricto a la API de Web Storage. Si el sistema sufre una inyección de script malicioso (vía dependencias vulnerables en `node_modules`, entradas no sanitizadas o inyección indirecta), el atacante puede extraer el token ejecutando `localStorage.getItem('token')` y enviarlo a un servidor externo.
* **Conclusión de Ingeniería:** Se tolera en entornos de pruebas o aplicaciones internas de bajo impacto, pero representa un riesgo significativo en entornos corporativos si no se acompaña de una política estricta de seguridad de contenido (*Content Security Policy* - CSP).

#### 2. Cookies con Banderas `HttpOnly`, `Secure` y `SameSite`
* **Mecánica:** El backend emite el token mediante la cabecera HTTP `Set-Cookie`. La bandera `HttpOnly` prohíbe terminantemente el acceso a la cookie desde el motor de JavaScript del navegador (`document.cookie` no puede leerla).
* **Inmunidad ante XSS:** Incluso si un script malicioso es inyectado en el frontend, no puede leer ni exfiltrar directamente la credencial.
* **Vector de Ataque Primario (CSRF):** Debido a que los navegadores adjuntan automáticamente las cookies en las peticiones salientes hacia el dominio de origen, un sitio web atacante podría inducir al navegador del usuario a emitir peticiones no deseadas hacia el servidor de la aplicación.
* **Mitigación:** Configurar la bandera `SameSite=Strict` o `SameSite=Lax`, exigir el protocolo cifrado mediante la bandera `Secure`, y complementar la arquitectura con tokens anti-CSRF o verificación obligatoria de cabeceras de origen (`Origin` y `Referer`).

#### 3. Almacenamiento en Memoria de React y Renovación Silenciosa (*Silent Refresh*)
* **Mecánica:** El token de acceso (*Access Token*) reside única y exclusivamente en una variable de estado en la memoria volátil de React. Al recargar la página, la memoria se purga de forma natural.
* **Mecanismo de Persistencia:** Se complementa con un token de actualización (*Refresh Token*) emitido exclusivamente en una cookie `HttpOnly` con tiempo de vida prolongado. Al iniciar o recargar la aplicación, el cliente despacha una petición en segundo plano al endpoint `/api/auth/refresh`; el backend verifica la cookie y entrega un nuevo token de acceso de corta duración (ej. 15 minutos) que se aloja en memoria.
* **Nivel de Seguridad:** Proporciona un aislamiento robusto frente a ataques XSS persistentes y minimiza la superficie de ataque general de la arquitectura.

---

### Cuadro Comparativo de Estrategias de Almacenamiento

La siguiente matriz técnica evalúa el balance de seguridad y operatividad entre las diferentes técnicas de almacenamiento en clientes web:

| Mecanismo de Almacenamiento | Persistencia ante Recarga | Inmunidad frente a Lectura XSS | Susceptibilidad a CSRF | Complejidad de Implementación | Nivel de Riesgo General |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`localStorage`** | Alta (Persiste hasta eliminación explícita). | Nula (Lectura abierta vía `window.localStorage`). | Nula (Requiere inyección manual en cabeceras). | Muy baja (API síncrona simple en cliente). | **Alto** frente a vectores XSS. |
| **`sessionStorage`** | Media (Se destruye al cerrar la pestaña). | Nula (Lectura abierta vía `window.sessionStorage`). | Nula (Requiere inyección manual en cabeceras). | Muy baja (API síncrona simple en cliente). | **Moderado** (Persistencia efímera pero vulnerable a XSS). |
| **Cookie `HttpOnly` + `SameSite`** | Alta (Definida por directiva `Max-Age`). | Total (Inaccesible desde código JavaScript). | Media (Mitigable con `SameSite` y CSRF Tokens). | Moderada (Requiere configuración estricta en servidor). | **Bajo** (Recomendado para producción corporativa). |
| **Memoria React + Refresh Token** | Nula en memoria (Delegada al flujo de refresh). | Muy alta (No reside en almacenamiento accesible). | Baja (El Refresh Token se aísla en cookie segura). | Alta (Requiere orquestación asíncrona de renovación). | **Mínimo** (Estándar de máxima seguridad en SPAs). |

---

### Inyección de Credenciales en Clientes HTTP e Interceptores con Axios

En el desarrollo de software profesional, transferir manualmente el token en cada llamada a la API resulta ineficiente, propenso a omisiones accidentales y genera un acoplamiento indeseado entre la lógica de negocio de los componentes y los detalles de infraestructura de red. El estándar de la industria exige transmitir la credencial mediante la cabecera HTTP estandarizada `Authorization` bajo el esquema `Bearer`:

$$\text{Authorization: Bearer } \langle\text{token}\rangle$$

Para centralizar esta inyección y gestionar las respuestas del servidor de forma uniforme, la biblioteca **Axios** ofrece el patrón de **interceptores de red** sobre instancias dedicadas. Un interceptor actúa como un *middleware* en el cliente, capturando la petición o la respuesta en puntos precisos de su ciclo de vida.

```
ARQUITECTURA DE INTERCEPTORES CON AXIOS EN EL CLIENTE

[Componente / Servicio]
          │
          │ Despacho de llamada (ej. api.get('/perfil'))
          ▼
[Interceptor de Petición (Request)]
  * Lee el token activo desde memoria o almacenamiento.
  * Inyecta: Authorization: Bearer <token>.
          │
          ▼  (Tránsito de Red hacia el Backend)
[Servidor Backend / API REST]
          │
          ▼  (Respuesta HTTP recibida)
[Interceptor de Respuesta (Response)]
  * ¿Código 2xx? ──► Retorna datos directamente al componente.
  * ¿Código 401? ──► Token expirado: purga storage y redirige a /login.
  * ¿Código 403? ──► Privilegios insuficientes: notifica o redirige a /acceso-denegado.
```

#### 1. Interceptor de Petición (*Request Interceptor*)
Se ejecuta de forma asíncrona previo a la salida del paquete HTTP hacia la red. Su responsabilidad primaria consiste en inspeccionar si existe un token de sesión activo y, en caso afirmativo, mutar el objeto de configuración adjuntando la cabecera `Authorization`.

#### 2. Interceptor de Respuesta (*Response Interceptor*)
Se ejecuta inmediatamente al recibir la respuesta del servidor, antes de que la promesa sea resuelta o rechazada en el componente de origen. Centraliza la detección de anomalías de seguridad mediante códigos de estado HTTP:
* **HTTP 401 (*Unauthorized*):** Indica que la credencial ha expirado, fue revocada o presenta alteraciones. El interceptor ejecuta la purga de los identificadores de sesión en almacenamiento local y redirige al usuario hacia la pantalla de autenticación.
* **HTTP 403 (*Forbidden*):** Señala que la identidad del usuario es válida, pero este carece de los privilegios requeridos para ejecutar la acción solicitada. El interceptor gestiona la notificación de denegación sin forzar la desconexión del usuario.

A continuación se presenta la implementación modular de un cliente HTTP con Axios en TypeScript:

```typescript
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const CLAVE_STORAGE = 'auth_access_token';

// Creación de una instancia desacoplada y configurada de Axios
export const clienteApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.empresa.com/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 1. Interceptor de Petición: Inyección automática de cabecera Bearer
clienteApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem(CLAVE_STORAGE);

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 2. Interceptor de Respuesta: Tratamiento centralizado de errores 401 y 403
clienteApi.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa (2xx), retorna el payload directamente
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        // Token caducado o inválido: destrucción de sesión y desalojo
        console.warn('Sesión caducada o credencial inválida. Redirigiendo a acceso...');
        localStorage.removeItem(CLAVE_STORAGE);
        
        // Redirección controlada al flujo de ingreso
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }

      if (status === 403) {
        // Privilegios insuficientes: se registra el rechazo de autorización
        console.error('Acceso denegado: El usuario carece de permisos suficientes (403).');
      }
    }

    return Promise.reject(error);
  }
);
```

---

### Defensa en Profundidad y Principio de No Confianza en el Cliente

El principio fundacional de la seguridad en sistemas distribuidos postula que **el frontend es un entorno de ejecución hostil y no confiable**. El usuario, un atacante o una extensión del navegador tienen control irrestricto sobre las herramientas de desarrollo (*DevTools*), los objetos en memoria y las variables locales de JavaScript.

#### Distinción entre Seguridad y Experiencia de Usuario
Las guardas de navegación en React Router y la ocultación condicional de componentes no deben catalogarse jamás como barreras de seguridad. Constituyen exclusivamente mecanismos de **optimización de la experiencia de usuario (UX)** orientados a evitar que el operador interactúe con formularios o pantallas que resultarán en fallos de operación.

La **seguridad real e indelegable reside exclusivamente en la autorización del backend**. Incluso si un atacante altera el código JavaScript en su navegador para forzar `estaAutenticado = true` o modificar su rol a `ADMIN`, cada solicitud dirigida a la API REST o GraphQL será interceptada por los *middlewares* de autenticación y autorización del servidor. Si la firma criptográfica es inválida o el usuario carece de permisos en la base de datos, el servidor responderá indefectiblemente con códigos `401 Unauthorized` o `403 Forbidden`.

```
DEFENSA EN PROFUNDIDAD: CLIENTE VS. SERVIDOR

[Frontend: Entorno Hostil / No Confiable]
├── Componentes Guardián (<ProtectedRoute>)   ──► [Optimización de UX]
├── Renderizado Condicional por Rol           ──► [Optimización de UX]
└── Decodificación de Claims (atob)           ──► [Sincronización Visual]
                       │
             (Petición sobre HTTP/TLS)
                       ▼
[Backend: Entorno Seguro / Fuente de Verdad]
├── Verificación de Firma Criptográfica       ──► [Seguridad Real de Autenticación]
├── Validación de Integridad y Expiración     ──► [Seguridad Real de Integridad]
└── Control de Acceso a Recursos y BD         ──► [Seguridad Real de Autorización]
```

#### Variables de Entorno en el Frontend: Mitología y Realidad
Un anti-patrón de seguridad crítico y reiterado consiste en asumir que las variables de entorno inyectadas mediante herramientas de empaquetado (como `import.meta.env.VITE_*` en Vite o `process.env.REACT_APP_*` en Create React App) son secretas.

Los empaquetadores operan durante la etapa de construcción (*build time*) reemplazando estáticamente cada referencia por su valor literal en texto plano dentro de los archivos JavaScript resultantes. Por lo tanto:

* **Valores Permitidos:** Direcciones base de APIs públicas (`VITE_API_BASE_URL`), identificadores públicos de servicios de analítica o identificadores de clientes de OAuth.
* **Valores Terminantemente Prohibidos:** Claves privadas de firma criptográfica, secretos de API (*Client Secrets*), contraseñas de bases de datos o llaves de servicios de pago (como la clave secreta de Stripe). Si se incluyen en el frontend, quedan expuestos públicamente en los artefactos distribuidos en la web.

---

### Anti-patrones Comunes de Seguridad en Frontend

Para reforzar el criterio de ingeniería del equipo de desarrollo, a continuación se analizan los errores arquitectónicos más perjudiciales detectados en implementaciones reales:

1. **Confiar en Afirmaciones del Token sin Confirmación del Servidor:** Tomar decisiones críticas en la base de datos basándose en que el cliente despachó un campo `{ role: 'admin' }` en el cuerpo del JSON, en lugar de extraer la identidad verificada a partir del token firmado validado por el backend.
2. **Ignorar la Desincronización por Expiración de Token:** Mantener al usuario navegando indefinidamente en la interfaz mientras sus peticiones de fondo fallan silenciosamente con errores 401, en lugar de capturar la expiración y activar una expulsión o renovación ordenada.
3. **Persistir Datos Sensibles en Almacenamiento Local:** Guardar números de tarjeta de crédito, documentos de identidad o contraseñas en `localStorage` con el pretexto de acelerar futuras transacciones.
4. **Falta de Políticas CSP (*Content Security Policy*):** Desplegar aplicaciones web sin cabeceras CSP que restrinjan los dominios autorizados para cargar scripts externos, facilitando ataques de inyección y extracción de tokens.

