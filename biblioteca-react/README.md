# 📚 Biblioteca React - Manejo de Estado y Reactividad (Bloque 2)

Proyecto introductorio y pedagógico desarrollado para los alumnos de **Algoritmos III (Instituto Hilet)**, diseñado para ilustrar de forma concisa y práctica los conceptos fundamentales del apunte `bloque_02_reactividad_estado_formularios.md`.

---

## 🎯 Propósito Pedagógico

Demostrar en una interfaz visual limpia y con un número mínimo de componentes:
1. **Cómo y cuándo usar `useState`**:
   - Memoria interna que sobrevive a los ciclos de renderizado.
   - Componentes controlados (`value` + `onChange`) como **Fuente Única de Verdad**.
   - Principio de **Inmutabilidad**: Inserción mediante spread operator (`[...prev, nuevo]`), modificación con `map()` y eliminación con `filter()`.
2. **Cómo y cuándo usar `useEffect`**:
   - **Efecto al Montaje (`[]`)**: Carga simulada de libros desde una fuente asíncrona (con estado de carga / spinner).
   - **Efecto de Sincronización con Dependencias (`[libros]`)**: Sincronización reactiva con `localStorage` y actualización del `document.title` en cada cambio.
3. **Estado Derivado Puro**:
   - Cómo calcular métricas (total, disponibles, prestados) y filtros de búsqueda al vuelo durante el render sin crear variables `useState` redundantes.

---

## 📂 Estructura del Proyecto

```text
biblioteca-react/
├── src/
│   ├── components/
│   │   ├── Biblioteca.tsx         # Componente principal de la vista (estados, efectos y métricas)
│   │   ├── LibroForm.tsx          # Formulario controlado (useState, preventDefault, validación)
│   │   ├── LibroItem.tsx          # Tarjeta de libro (acciones inmutables de préstamo y borrado)
│   │   └── PanelPedagogico.tsx    # Guía explicativa interactiva en pantalla
│   ├── data/
│   │   └── librosIniciales.ts     # Colección semilla de libros
│   ├── types/
│   │   └── libro.ts               # Interfaz tipada del modelo Libro
│   ├── App.tsx                    # Contenedor raíz minimalista (solo monta <Biblioteca />)
│   ├── App.css                    # Estilos limpios y responsivos
│   └── main.tsx                   # Punto de entrada de React 19
├── index.html
├── package.json
└── vite.config.ts
```

---

## 🚀 Cómo Ejecutar

Desde la raíz del repositorio o dentro de `biblioteca-react`:

```bash
# Desde la raíz del repositorio:
npm run dev:react

# O directamente dentro de la carpeta biblioteca-react:
cd biblioteca-react
npm run dev
```

La aplicación estará disponible en [http://localhost:5173](http://localhost:5173).

Para compilar y verificar tipos:

```bash
npm run build:react
```

---

## 🔍 Guía de Lectura de Código para Alumnos

- **`src/App.tsx`**: Contenedor raíz limpio y desacoplado que importa y renderiza `<Biblioteca />`.
- **`src/components/Biblioteca.tsx`**: Contiene la declaración del estado `libros`, los dos `useEffect` (montaje y sincronización) y las funciones de actualización inmutable (`handleAgregarLibro`, `handleToggleDisponibilidad`, `handleEliminarLibro`).
- **`src/components/LibroForm.tsx`**: Muestra cómo vincular `value={...}` y `onChange={...}` para que React controle los inputs, y cómo evitar el refresco de pantalla con `e.preventDefault()`.
- **`src/components/LibroItem.tsx`**: Muestra la emisión de eventos hacia el componente padre mediante callbacks.
