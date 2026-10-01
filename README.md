# Algoritmos III - Instituto Hilet

Repositorio general de la cátedra de Algoritmos III y Gestión de Desarrollo de Software.

---

## 📚 Bloque 2: Reactividad, Estado Local y Formularios Controlados

Este repositorio contiene dos proyectos interactivos gemelos desarrollados con **TypeScript** y **Vite**, diseñados para plasmar todos los conceptos del apunte pedagógico `bloque_02_reactividad_estado_formularios.md` y conectarlos con el Trabajo Práctico de la materia (**Sistema de Gestión de Biblioteca**):

1. **`biblioteca-react`**: Implementación en **React 19 + TypeScript** (Puerto `5173`).

---

## 🚀 Inicio Rápido

Desde la raíz del repositorio puedes ejecutar cualquiera de las aplicaciones o ambas en paralelo:

```bash
# Iniciar la aplicación React (http://localhost:5173)
npm run dev:react

# Iniciar la aplicación Vue (http://localhost:5174)
npm run dev:vue

# Compilar y validar tipos en ambos proyectos simultáneamente
npm run build:all
```

---

## 🏛️ Arquitectura Feature-Based

En lugar de una organización técnica tradicional (todos los componentes mezclados en una carpeta general), la arquitectura se divide según el **dominio de negocio de la biblioteca**:

```text
src/
├── features/
│   ├── libros/                     # Feature Principal (Catálogo y Mutación de Libros)
│   │   ├── components/
│   │   │   ├── LibroForm           # Formulario controlado (Alta y Modo Edición)
│   │   │   ├── LibroCard           # Tarjeta individual con mutación funcional de stock
│   │   │   ├── LibroList           # Catálogo, grid y filtros
│   │   │   ├── LibroStats          # Estado derivado puro (sin useState redundante)
│   │   │   └── LibroFiltros        # Búsqueda reactiva por texto y select
│   │   ├── hooks/ / composables/   # useLibros: Lógica de estado y persistencia
│   │   ├── services/               # libroService: Persistencia y simulación de API
│   │   ├── types/                  # libro.types: DTOs y modelos coincidentes con C#
│   │   └── utils/                  # validaciones: Reglas de negocio puras
│   └── socios/                     # Feature Secundaria (Padrón de Socios)
│       ├── components/             # SocioForm y SocioList
│       ├── hooks/ / composables/   # useSocios: Estado aislado
│       └── types/                  # socio.types
├── components/
│   ├── layout/                     # Header, Navbar, Footer
│   └── pedagogico/                 # Laboratorio Stale Closures, Inspector Fiber/Proxy
└── styles/                         # Tokens de diseño oficiales del Instituto Hilet
```

---

## 🔬 Conceptos Pedagógicos del Bloque 2 Demostrados

### 1. Estado Inicial y Mutación de Objetos
* **Estado Semilla**: El catálogo inicia con una colección de libros tipados (`Libro[]`) que replican el esquema de `init.sql` y los DTOs de C# (`CrearLibroDto`, `ModificarLibroDto`).
* **Modo Edición / Mutación**: Al presionar **"Editar / Mutar"** en cualquier tarjeta, el objeto seleccionado se inyecta en el formulario. Al guardar:
  * **En React**: Se aplica una actualización inmutable con `setLibros(prev => prev.map(l => l.id === id ? { ...l, ...formData } : l))`.
  * **En Vue 3**: El composable actualiza las propiedades directamente mediante `Object.assign(libro, formData)`, activando el sistema reactivo de Proxies.

### 2. Componentes Controlados y Eventos Sintéticos (Sección 2.2)
* **Fuente Única de Verdad**: Los inputs enlazan su propiedad visual con el estado (`value` en React, `v-model` en Vue).
* **Manejador Unificado con Clave Dinámica**: Un único método genérico sincroniza texto, números (`Number()`) y casillas booleanas (`type === 'checkbox' ? e.target.checked : e.target.value`) computando `[name]: valor`.
* **Prevención de Recarga**: Uso explícito de `evento.preventDefault()` (`@submit.prevent` en Vue) para impedir la recarga del documento en aplicaciones SPA.
* **Validación Pura en Tiempo Real**: Función pura `validarLibro(formData)` que valida obligatoriedad, longitud mínima y rango de ISBN (10 a 15 caracteres) sin efectos colaterales.

### 3. Inmutabilidad y Detección de Cambios (`Object.is` vs. Proxies)
* **Inspector en Tiempo Real**: Panel interactivo que monitorea el Fiber de React y visibiliza cómo la comparación $O(1)$ de `Object.is` aprueba el render solo cuando se crea una nueva dirección en memoria (`0x100 !== 0x200`).
* **Botón de Antipatrón Didáctico**: Permite al alumno disparar una mutación directa sobre el objeto sin llamar al setter de React, demostrando experimentalmente por qué la interfaz gráfica no se actualiza cuando se rompe la inmutabilidad.

### 4. Actualizaciones Funcionales y Prevención de *Stale Closures*
* **Laboratorio Interactivo**: Compara de forma visual el triple incremento inseguro `set(val + 1)` x3 (que falla por capturar el closure congelado) versus el seguro `set(prev => prev + 1)` x3 (que consume la cola del Fiber).
* **Control de Stock**: Los botones de incremento `+1` y decremento `-1` de ejemplares usan actualizadores funcionales para soportar clics rápidos y lotes automáticos (*Automatic Batching*).

### 5. Eliminación del Estado Redundante (Sección 2.1)
* Métricas como *Total de Títulos*, *Total de Ejemplares*, *Disponibles para Préstamo* y *Agotados* se calculan al vuelo en render (en React con `useMemo` y en Vue con `computed()`), evitando variables `useState` separadas que causarían desincronización.

---

## ⚖️ Cuadro Comparativo: React vs Vue 3

| Característica | React 19 (`biblioteca-react`) | Vue 3.5 (`biblioteca-vue`) |
| :--- | :--- | :--- |
| **Primitiva de Estado** | `useState<T>(initialValue)` | `ref<T>()` / `reactive<T>()` |
| **Paradigma Reactivo** | Inmutabilidad obligatoria (`...spread`, `map`, `filter`) | Mutabilidad observable vía `Proxy` (`get`/`set` traps) |
| **Detección de Cambios** | `Object.is(oldRef, newRef)` | Suscripciones granulares de dependencias |
| **Formularios** | Componentes controlados (`value` + `onChange`) | Two-way data binding (`v-model`) |
| **Estado Derivado** | Variables puras en render o `useMemo()` | Propiedades computadas con `computed()` |
| **Batching / Concurrencia** | `setEstado(prev => ...)` (Anti-stale closure) | Sincrónico en script, batch DOM en `nextTick()` |
| **Arquitectura** | Feature-Based (`features/libros`, `features/socios`) | Feature-Based (`features/libros`, `features/socios`) |

---

## 🛠️ Tecnologías Empleadas

* **TypeScript 6.x**: Tipado estático estricto, interfaces DTO, sin tipos `any`.
* **React 19 / Vue 3.5**: Versiones modernas con TSX y SFC `<script setup lang="ts">`.
* **Vite 8**: Servidor de desarrollo ultrarrápido y empaquetador optimizado.
* **Lucide Icons**: Iconografía técnica oficial (`lucide-react` y `@lucide/vue`).
* **Design System Hilet**: Paleta institucional basada en el Trabajo Práctico de biblioteca.
