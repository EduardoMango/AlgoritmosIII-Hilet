# Demo: Autenticación, Rutas Protegidas y Axios Interceptors (Bloque 6)

Este proyecto implementa los conceptos fundamentales abordados en el **Bloque 6: Autenticación, Rutas Protegidas y Seguridad en el Frontend**:
- Flujo de autenticación sin estado (*stateless*) con JWT y rotación de Refresh Token.
- Manejo de sesión global reactivo con `AuthContext` y prevención de parpadeos de navegación (*Flash of Unauthenticated Content* - FOUC).
- Enrutamiento seguro con **React Router 6** mediante componentes de diseño guardián (`<RutaProtegida>`, `<RutaPublicaExclusiva>`) y preservación del historial post-login.
- Control de acceso basado en roles (RBAC) macroscópico (a nivel ruta) y microscópico (a nivel componente).
- Cliente HTTP desacoplado con **Axios** e interceptores de red para inyección automática de cabeceras Bearer y renovación silenciosa (*Silent Refresh*) ante errores 401 con cola de peticiones concurrentes.
- Consumo del backend simulado mediante los endpoints oficiales de [DummyJSON Auth](https://dummyjson.com/docs/auth).

---

## Estructura del Proyecto

```
src/
├── types/
│   └── auth.ts                 # Definiciones e interfaces TypeScript (Usuario, JWT Payload, Respuestas API)
├── utils/
│   └── jwt.ts                  # Decodificación segura de JWT y comprobación de expiración preventiva
├── services/
│   └── api.ts                  # Cliente Axios, endpoints DummyJSON e interceptores de petición/respuesta
├── context/
│   └── AuthContext.tsx         # Proveedor y Hook useAuth con bandera cargandoAutenticacion (anti-FOUC)
├── components/
│   ├── RutaProtegida.tsx       # Guardián de rutas con soporte para RBAC y preservación de estado
│   ├── RutaPublicaExclusiva.tsx# Redirección de usuarios autenticados fuera de /login
│   ├── ElementoSeguroPorRol.tsx# Renderizado condicional granular por rol en el DOM
│   └── Navbar.tsx              # Barra de navegación reactiva al estado de sesión
├── pages/
│   ├── PaginaLogin.tsx         # Formulario de acceso con credenciales rápidas de prueba
│   ├── PanelGeneral.tsx        # Panel central con botón "Ver Perfil", simulador de expiración e inspección de token
│   ├── PaginaPerfil.tsx        # Ruta protegida que consulta automáticamente GET /auth/me
│   ├── PaginaAdmin.tsx         # Ruta protegida restringida a rol ADMIN
│   └── VistaAccesoDenegado.tsx # Pantalla informativa 403 Forbidden
├── routes/
│   └── AppRoutes.tsx           # Configuración declarativa de rutas y guardianes
├── styles/
│   └── global.css              # Estilos sobrios y estilizados sin emojis
├── App.tsx                     # Envoltorio de enrutador y contexto global
└── main.tsx                    # Punto de entrada de la aplicación Vite
```

---

## Usuarios de Prueba (DummyJSON)

| Usuario | Contraseña | Rol en DummyJSON | Acceso a /admin |
| :--- | :--- | :--- | :--- |
| `emilys` | `emilyspass` (o `emilyspassword`) | `ADMIN` (Inyectado / Verificado) | Permitido (200 OK) |
| `averyp` | `averyppass` | `USER` (Rol nativo de DummyJSON) | Denegado (403 Forbidden) |

> **Nota sobre DummyJSON y Roles:**  
> DummyJSON no incluye el atributo `role` en la respuesta directa de `POST /auth/login` ni en las *claims* del JWT. Sin embargo, sí lo expone al consultar `GET /auth/me`. El servicio `login` ahora consulta automáticamente `GET /auth/me` para capturar el rol real y, adicionalmente, inyecta con certeza el rol `ADMIN` para `emilys` con fines de prueba y evaluación de RBAC.

---

## Flujos Demostrativos Destacados

### 1. Botón "Ver Perfil" (`GET /auth/me`)
- Al hacer clic en **"Ver Perfil (GET /auth/me)"** en el panel principal o al ingresar a la ruta `/perfil`, el cliente despacha la petición al servidor.
- El interceptor de Axios inyecta automáticamente la cabecera `Authorization: Bearer <accessToken>`.
- DummyJSON verifica el token y retorna los datos completos del usuario autenticado.

### 2. Renovación Silenciosa Automática (*Silent Refresh*)
- En el panel principal se dispone del botón **"Simular Expiración de Access Token"**, el cual altera deliberadamente el access token local.
- Al presionar **"Ver Perfil"** tras invalidar el token:
  1. La petición a `/auth/me` falla con código `401 Unauthorized`.
  2. El interceptor de respuesta de Axios detecta el `401` e intercepta el fallo.
  3. Despacha una solicitud a `POST https://dummyjson.com/auth/refresh` enviando el `refreshToken`.
  4. DummyJSON devuelve un nuevo par de tokens.
  5. El interceptor actualiza el almacenamiento, sincroniza el estado en React y reintenta de forma transparente la petición original a `/auth/me`.
  6. La interfaz muestra los datos con éxito (200 OK) sin que el usuario sea desconectado.
- El panel incluye un cuadro de registro de eventos para visualizar este ciclo en tiempo real.

### 3. Preservación del Historial Post-Login
- Si un usuario no autenticado intenta abrir directamente `http://localhost:5173/perfil`, el guardián `<RutaProtegida>` captura la ubicación en `location.state.from` y redirige a `/login`.
- Tras autenticarse, el sistema devuelve automáticamente al usuario a `/perfil` en lugar de enviarlo a una ruta genérica.

### 4. Control de Acceso por Roles (RBAC)
- Si un usuario con rol `USER` (como `michaelw`) intenta acceder a `/admin`, la guarda de ruta lo redirige inmediatamente a la vista informativa de acceso denegado (`/acceso-denegado`).
- Si ingresa como `emilys` (`ADMIN`), la ruta se desbloquea normalmente.

---

## Comandos para Ejecutar el Proyecto

```bash
# Instalar dependencias (si no se han instalado)
npm install

# Iniciar servidor de desarrollo en http://localhost:5173
npm run dev

# Compilar para producción y verificar tipos TypeScript
npm run build
```

