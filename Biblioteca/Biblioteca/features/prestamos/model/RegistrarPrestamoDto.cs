using Biblioteca.Features.Libros;
using Biblioteca.Features.Libros.Model;
using Biblioteca.Features.Socios;
using Biblioteca.Features.Socios.Model;
using Biblioteca.Features.Prestamos;
using Biblioteca.Features.Prestamos.Model;
using Biblioteca.Features.Common.Exceptions;
using Biblioteca.Features.Common.Infrastructure;

using System.ComponentModel.DataAnnotations;

namespace Biblioteca.Features.Prestamos.Model;

public record RegistrarPrestamoDto(
    [Required(ErrorMessage = "El ID del socio es obligatorio")]
    int SocioId,

    [Required(ErrorMessage = "El ID del libro es obligatorio")]
    int LibroId
);
