using Biblioteca.Features.Libros;
using Biblioteca.Features.Libros.Model;
using Biblioteca.Features.Socios;
using Biblioteca.Features.Socios.Model;
using Biblioteca.Features.Prestamos;
using Biblioteca.Features.Prestamos.Model;
using Biblioteca.Features.Common.Exceptions;
using Biblioteca.Features.Common.Infrastructure;

using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Biblioteca.Features.Libros;

public static class LibroEndpoints
{
    public static void MapLibroEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/libros").WithTags("Libros");

        group.MapPost("/", async (CrearLibroDto dto, ILibroService service) =>
        {
            var result = await service.CreateAsync(dto);
            return Results.Created($"/api/libros/{result.Id}", result);
        });

        group.MapGet("/", async (ILibroService service) =>
        {
            var result = await service.GetAllAsync();
            return Results.Ok(result);
        });

        group.MapGet("/{id:int}", async (int id, ILibroService service) =>
        {
            var result = await service.GetByIdAsync(id);
            return Results.Ok(result);
        });

        group.MapPut("/{id:int}", async (int id, ModificarLibroDto dto, ILibroService service) =>
        {
            var result = await service.UpdateAsync(id, dto);
            return Results.Ok(result);
        });

        group.MapDelete("/{id:int}", async (int id, ILibroService service) =>
        {
            await service.DeleteAsync(id);
            return Results.NoContent();
        });
    }
}
