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

public record PrestamoDto(
    int Id,
    int SocioId,
    int LibroId,
    DateTime FechaPrestamo,
    DateTime? FechaDevolucion
);
