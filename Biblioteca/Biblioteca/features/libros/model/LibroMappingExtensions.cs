using Biblioteca.Features.Libros;
using Biblioteca.Features.Libros.Model;
using Biblioteca.Features.Socios;
using Biblioteca.Features.Socios.Model;
using Biblioteca.Features.Prestamos;
using Biblioteca.Features.Prestamos.Model;
using Biblioteca.Features.Common.Exceptions;
using Biblioteca.Features.Common.Infrastructure;

namespace Biblioteca.Features.Libros.Model;

public static class LibroMappingExtensions
{
    public static Libro ToEntity(this CrearLibroDto dto)
    {
        return new Libro(0, dto.Titulo, dto.Autor, dto.Isbn, dto.CantidadDisponible);
    }

    public static Libro ToEntity(this ModificarLibroDto dto, int id, string isbn)
    {
        return new Libro(id, dto.Titulo, dto.Autor, isbn, dto.CantidadDisponible);
    }

    public static LibroDto ToResponse(this Libro entity)
    {
        return new LibroDto(entity.Titulo, entity.Autor, entity.Isbn, entity.CantidadDisponible);
    }
}
