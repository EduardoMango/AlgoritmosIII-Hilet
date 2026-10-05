# 📚 Biblioteca React - Ciclo de Vida, Efectos y APIs REST (Bloque 3)

Proyecto pedagógico desarrollado para los alumnos de **Algoritmos III (Instituto Hilet)**, diseñado para ilustrar de forma concisa, práctica y profesional los conceptos fundamentales del apunte `bloque_03_ciclo_de_vida_efectos_apis.html`.

---

## 🎯 Propósito Pedagógico (Bloque 3)

Demostrar en una arquitectura modular limpia de React 19 + TypeScript + Vite:
1. **Efectos Secundarios y `useEffect`**:
   - **Montaje (`[]`)**: Petición HTTP asíncrona real para cargar el catálogo al montar el componente (fase *post-commit*).
   - **Manejo del ciclo de vida asíncrono**: Definición de funciones asíncronas internas (`async function cargarCatalogo()`) dentro del efecto para no romper la firma de `useEffect`.
   - **Sincronización declarativa**: Actualización del título de la pestaña (`document.title`) en respuesta a cambios de datos.
2. **Patrón del Triplete de Estados de Asincronía**:
   - Modelado determinista de `cargando` (loading: boolean), `libros` (data: T[]) y `error` (string | null).
   - Renderizado condicional accesible de cada fase (spinner de carga, mensaje de error con reintento, estado vacío y listado exitoso).
3. **Consumo de APIs REST con JSON Server**:
   - Servidor backend simulado con persistencia en `db.json`.
   - Implementación de operaciones CRUD mediante verbos HTTP estándar:
     - `GET /libros`: Obtención del listado.
     - `POST /libros`: Creación de un libro con `id` asignado automáticamente.
     - `PATCH /libros/:id`: Actualización parcial del estado de disponibilidad/préstamo.
     - `DELETE /libros/:id`: Eliminación física del registro en la base de datos.
4. **Arquitectura Modular de Acceso a Datos**:
   - Separación de capas: `src/api/clienteHttp.ts` (transporte Axios, variables de entorno `VITE_API_URL` e interceptores) y `src/servicios/libroServicio.ts` (contratos tipados del dominio).
   - Comparativa didáctica en vivo: Posibilidad de alternar entre cliente `axios` y la API nativa `fetch` en la interfaz.
5. **Prevención de Antipatrones**:
   - Cálculo de estado derivado (búsqueda y métricas) en tiempo de renderizado sin `useEffect` redundantes.
   - Algoritmo de reconciliación utilizando `key={libro.id}` estable y única (evitando `key={index}`).

---

## 📂 Estructura del Proyecto

```text
biblioteca-react/
├── db.json                     # Base de datos JSON para json-server
├── .env                        # Variables de entorno para Vite (VITE_API_URL)
├── .env.example                # Plantilla de variables de entorno
├── src/
│   ├── api/
│   │   └── clienteHttp.ts      # Cliente Axios centralizado con interceptores y timeout
│   ├── servicios/
│   │   └── libroServicio.ts    # Servicios REST tipados (GET, POST, PATCH, DELETE)
│   ├── types/
│   │   └── libro.ts            # Interfaces y DTOs (Libro, NuevoLibroDto)
│   ├── components/
│   │   ├── Biblioteca.tsx      # Vista principal (Triplete de asincronía, useEffect, CRUD)
│   │   ├── LibroForm.tsx       # Formulario controlado con petición HTTP POST
│   │   ├── LibroItem.tsx       # Tarjeta con operaciones HTTP PATCH y DELETE
│   │   └── PanelPedagogico.tsx # Panel explicativo de los conceptos de Bloque 3
│   ├── App.tsx                 # Contenedor raíz
│   ├── App.css                 # Estilos limpios y accesibles
│   └── main.tsx                # Entrada de React en StrictMode
├── package.json
└── vite.config.ts
```

---

## 🚀 Cómo Ejecutar

Para utilizar la aplicación completa con su API REST simulada, necesitas iniciar dos procesos:

### 1. Iniciar el Servidor de Datos (`json-server`)

En una terminal:

```bash
npm run server
```

El servidor REST estará disponible en `http://localhost:3001` exponiendo el endpoint `http://localhost:3001/libros`.

### 2. Iniciar la Aplicación React (`Vite`)

En otra terminal:

```bash
npm run dev
```

La interfaz web estará disponible en [http://localhost:5173](http://localhost:5173).

---

## 🔍 Comandos Disponibles

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Inicia el servidor de desarrollo de Vite (puerto 5173) |
| `npm run server` | Inicia JSON Server en el puerto 3001 con `db.json` |
| `npm run build` | Compila TypeScript y empaqueta la aplicación con Vite |
| `npm run preview` | Previsualiza el bundle compilado de producción |

---

## 💡 Guía de Lectura de Código para Alumnos

- **`src/api/clienteHttp.ts`**: Observa cómo se crea la instancia con `axios.create()`, cómo se lee `import.meta.env.VITE_API_URL` y cómo operan los interceptores de solicitud y respuesta.
- **`src/servicios/libroServicio.ts`**: Revisa cómo se encapsulan las llamadas HTTP REST del dominio y la versión didáctica con `fetch()` nativo.
- **`src/components/Biblioteca.tsx`**:
  - Revisa el primer `useEffect`: contiene la función asíncrona interna y la estructura `try/catch/finally` para gestionar el triplete de estados (`cargando`, `libros`, `error`).
  - Revisa cómo los filtros de búsqueda y los totales no usan `useState` innecesarios, sino cálculo derivado en el renderizado.
- **`src/components/LibroForm.tsx`**: Muestra cómo disparar el `POST` asíncrono y gestionar el estado de envío deshabilitando los controles mientras la red responde.
- **`src/components/LibroItem.tsx`**: Muestra la interacción con los verbos `PATCH` y `DELETE` con feedback visual inmediato.
