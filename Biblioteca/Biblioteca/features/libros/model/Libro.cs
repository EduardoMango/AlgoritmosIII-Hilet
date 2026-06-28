using Biblioteca.Features.Libros;
using Biblioteca.Features.Libros.Model;
using Biblioteca.Features.Socios;
using Biblioteca.Features.Socios.Model;
using Biblioteca.Features.Prestamos;
using Biblioteca.Features.Prestamos.Model;
using Biblioteca.Features.Common.Exceptions;
using Biblioteca.Features.Common.Infrastructure;

namespace Biblioteca.Features.Libros.Model;

public record Libro(
    int Id,
    string Titulo,
    string Autor,
    string Isbn,
    int CantidadDisponible
);
