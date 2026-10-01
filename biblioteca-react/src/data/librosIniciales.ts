import type { Libro } from '../types/libro';

/**
 * Datos semilla que simulan los registros provenientes de una base de datos o API.
 */
export const LIBROS_INICIALES: Libro[] = [
  {
    id: 1,
    titulo: 'Cien años de soledad',
    autor: 'Gabriel García Márquez',
    genero: 'Novela / Realismo Mágico',
    disponible: true,
  },
  {
    id: 2,
    titulo: 'Clean Code',
    autor: 'Robert C. Martin',
    genero: 'Ingeniería de Software',
    disponible: true,
  },
  {
    id: 3,
    titulo: 'El Aleph',
    autor: 'Jorge Luis Borges',
    genero: 'Ficción / Cuentos',
    disponible: false,
  },
  {
    id: 4,
    titulo: 'Design Patterns',
    autor: 'Gang of Four (GoF)',
    genero: 'Arquitectura de Software',
    disponible: true,
  },
];
