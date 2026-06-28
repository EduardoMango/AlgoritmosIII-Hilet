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

namespace Biblioteca.Features.Socios;

public static class SocioEndpoints
{
    public static void MapSocioEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/socios").WithTags("Socios");

        group.MapPost("/", async (CrearSocioDto dto, ISocioService service) =>
        {
            var result = await service.CreateAsync(dto);
            return Results.Created($"/api/socios/{result.Id}", result);
        });

        group.MapGet("/", async (ISocioService service) =>
        {
            var result = await service.GetAllAsync();
            return Results.Ok(result);
        });
    }
}
