/**
 * Modelo de datos para un libro de la biblioteca.
 */
export interface Libro {
  id: number;
  titulo: string;
  autor: string;
  genero: string;
  disponible: boolean;
}
