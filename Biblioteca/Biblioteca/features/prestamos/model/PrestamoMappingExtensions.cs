using Biblioteca.Features.Libros;
using Biblioteca.Features.Libros.Model;
using Biblioteca.Features.Socios;
using Biblioteca.Features.Socios.Model;
using Biblioteca.Features.Prestamos;
using Biblioteca.Features.Prestamos.Model;
using Biblioteca.Features.Common.Exceptions;
using Biblioteca.Features.Common.Infrastructure;

using System;

namespace Biblioteca.Features.Prestamos.Model;

public static class PrestamoMappingExtensions
{
    public static Prestamo ToEntity(this RegistrarPrestamoDto dto)
    {
        return new Prestamo(0, dto.SocioId, dto.LibroId, DateTime.UtcNow, null);
    }

    public static PrestamoDto ToResponse(this Prestamo entity)
    {
        return new PrestamoDto(entity.Id, entity.SocioId, entity.LibroId, entity.FechaPrestamo, entity.FechaDevolucion);
    }
}
