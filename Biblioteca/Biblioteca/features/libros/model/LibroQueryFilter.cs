namespace Biblioteca.Features.Libros.Model;

public record LibroQueryFilter()
{
    public string? Titulo { get; init; } = string.Empty;
    public string? Autor { get; init; } = string.Empty;
    public int? CantidadMin { get; init; }
    public int? CantidadMax { get; init; }
};