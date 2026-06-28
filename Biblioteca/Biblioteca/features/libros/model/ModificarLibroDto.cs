using Biblioteca.Features.Libros;
using Biblioteca.Features.Libros.Model;
using Biblioteca.Features.Socios;
using Biblioteca.Features.Socios.Model;
using Biblioteca.Features.Prestamos;
using Biblioteca.Features.Prestamos.Model;
using Biblioteca.Features.Common.Exceptions;
using Biblioteca.Features.Common.Infrastructure;

using System.ComponentModel.DataAnnotations;

namespace Biblioteca.Features.Libros.Model;

public record ModificarLibroDto(
    [Required(ErrorMessage = "El titulo es obligatorio")]
    string Titulo,

    [Required(ErrorMessage = "El autor es obligatorio")]
    string Autor,

    [Required(ErrorMessage = "El ISBN es obligatorio")]
    string Isbn,

    [Range(0, int.MaxValue, ErrorMessage = "La cantidad disponible debe ser mayor o igual a cero")]
    int CantidadDisponible
);
