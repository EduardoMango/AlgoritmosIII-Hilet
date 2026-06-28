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

namespace Biblioteca.Features.Prestamos;

public static class PrestamoEndpoints
{
    public static void MapPrestamoEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/prestamos").WithTags("Prestamos");

        group.MapPost("/", async (RegistrarPrestamoDto dto, IPrestamoService service) =>
        {
            var result = await service.CreateAsync(dto);
            return Results.Created($"/api/prestamos/{result.Id}", result);
        });

        group.MapPost("/{id:int}/devolucion", async (int id, IPrestamoService service) =>
        {
            var result = await service.ReturnAsync(id);
            return Results.Ok(result);
        });

        group.MapGet("/", async (IPrestamoService service) =>
        {
            var result = await service.GetAllAsync();
            return Results.Ok(result);
        });
    }
}
