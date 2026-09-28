# Proyecto Demostrativo: Introducción a React y Componentes Básicos

**Cátedra:** Gestión de Desarrollo de Software / Algoritmos y Programación III  
**Material de Referencia:** `dist/apuntes/bloque_01_filosofia_y_componentes.html`  
**Tooling:** Vite + React 19 + TypeScript (TSX)

---

## 1. Propósito del Proyecto
Este proyecto fue diseñado como un primer acercamiento práctico e interactivo a los fundamentos de React. Contiene componentes elementales y funcionalidades primitivas que ilustran de forma directa los conceptos teóricos y arquitectónicos expuestos en el Bloque 1:

1. **Filosofía y Arquitectura Frontend:**
   - Principio de Inversión de Control (IoC) y distinción entre librería y framework.
   - Demostración práctica de la fórmula declarativa: $\text{UI} = f(\text{State})$.
   - Comparación directa entre la manipulación imperativa del DOM (Vanilla JS) y el enfoque declarativo reactivo.
   - Visualización por fases del ciclo de actualización del **Virtual DOM** (Render, Reconciliación lineal $O(n)$ y Commit en batching).

2. **Sintaxis JSX y TSX:**
   - Cumplimiento de las 3 reglas de sintaxis (único nodo raíz / Fragmentos `<>...</>`, expresiones dinámicas `{ }`, y atributos en convención `camelCase`).
   - Contratos de entrada fuertemente tipados mediante `interface` en TypeScript.
   - Demostración del proceso de transpilación hacia el runtime de React (`_jsx`).

3. **Componentes Funcionales y Props (Flujo Unidireccional):**
   - Implementación de componentes funcionales puros (determinismo y ausencia de efectos secundarios en render).
   - Flujo de datos estrictamente descendente (*Top-Down*).
   - Inmutabilidad estricta de `props` y uso de variables locales derivadas para evitar anti-patrones.
   - Patrón de destructuración y valores por defecto (*default parameters*).

4. **Composición de Interfaces mediante `props.children`:**
   - Implementación del patrón de contenedor reutilizable (*Wrapper*) con `PanelContenedor`.
   - Tipado de la prop especial `children` mediante `React.ReactNode`.
   - Desacoplamiento estructural entre el contenedor y el contenido inyectado.

5. **Matriz Comparativa de Conceptos:**
   - Tabla interactiva con búsqueda que compara punto a punto el paradigma imperativo versus el declarativo.

---

## 2. Estructura del Código Fuente

```
introduccion-react/
├── index.html                   # Entrada HTML con <div id="root">
├── package.json                 # Dependencias y scripts de Vite
├── tsconfig.json                # Configuración estricta de TypeScript
├── vite.config.ts               # Configuración del empaquetador Vite
└── src/
    ├── main.tsx                 # Montaje en createRoot() con React.StrictMode
    ├── App.tsx                  # Componente orquestador con navegación por pestañas
    ├── App.css                  # Estilos aplicados con tokens de diseño de la cátedra
    ├── index.css                # Variables CSS, reset y fuentes
    ├── types/
    │   └── index.ts             # Interfaces TypeScript de dominio y contratos de props
    └── components/
        ├── common/              # Primitivas didácticas reutilizables
        │   ├── BotonAccion.tsx         # Props con destructuración y valores por defecto
        │   ├── IndicadorEstado.tsx     # Componente funcional puro
        │   ├── TarjetaProducto.tsx     # Tipado TSX con interfaces y condicionales
        │   ├── PanelContenedor.tsx     # Patrón contenedor usando props.children
        │   └── ContadorDeclarativo.tsx # Demostración viva de UI = f(State)
        ├── sections/            # Vistas temáticas del Bloque 1
        │   ├── FilosofiaSection.tsx    # IoC, Declarativo vs Imperativo, VDOM
        │   ├── SintaxisJsxSection.tsx  # Reglas JSX, evaluación {}, TSX
        │   ├── ComponentesPropsSection.tsx # Funciones puras, inmutabilidad, playground
        │   ├── ComposicionChildrenSection.tsx # Inyección de contenido flexible
        │   └── ComparativaSection.tsx  # Tabla comparativa con filtrado dinámico
        └── layout/              # Estructura general
            ├── Header.tsx              # Encabezado institucional
            ├── Navbar.tsx              # Barra de navegación por módulos
            └── Footer.tsx              # Créditos de la cátedra
```

---

## 3. Instrucciones de Ejecución

Para iniciar el servidor de desarrollo local:

```bash
# 1. Posicionarse en el directorio del proyecto
cd proyects/introduccion-react

# 2. Instalar dependencias (si no se realizó previamente)
npm install

# 3. Iniciar el servidor de desarrollo con recarga rápida (HMR)
npm run dev
```

El servidor estará accesible en: `http://localhost:5173/`

Para compilar y verificar el tipado estático para producción:

```bash
npm run build
```

