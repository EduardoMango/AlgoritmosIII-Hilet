using Biblioteca.Features.Libros.Model;

namespace Biblioteca.Features.Libros;

public static class LibroEndpoints
{
    public static void MapLibroEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/libros").WithTags("Libros");

        group.MapPost("/", async (CrearLibroDto dto, ILibroService service) =>
        {
            var result = await service.CreateAsync(dto);
            return TypedResults.Created($"/api/libros/{result.Isbn}", result);
        });

        group.MapGet("/", async ( HttpContext context,
            [AsParameters] LibroQueryFilter filtrado, 
            ILibroService service) =>
        {
            var result = await service.GetAllAsync(filtrado);
            
            //Encabezado para cachear los resultados
            context.Response.Headers.CacheControl = "public, max-age=60";
            
            return TypedResults.Ok(result);
        });

        group.MapGet("/{isbn:length(10,15)}", async (string isbn, ILibroService service) =>
        {
            var result = await service.GetByIsbnAsync(isbn);
            return TypedResults.Ok(result);
        });
        
        // group.MapGet("/{isbn:length(16,20)}", async (string isbn, ILibroService service) => 
        //     TypedResults.Ok("Te pasaste de caracteres capo"));

        group.MapPut("/{isbn:length(10,15)}", async (string isbn, ModificarLibroDto dto, ILibroService service) =>
        {
            var result = await service.UpdateAsync(isbn, dto);
            return TypedResults.Ok(result);
        });

        group.MapDelete("/{isbn:length(10,15)}", async (string isbn, ILibroService service) =>
        {
            await service.DeleteAsync(isbn);
            return TypedResults.NoContent();
        });
    }
}
