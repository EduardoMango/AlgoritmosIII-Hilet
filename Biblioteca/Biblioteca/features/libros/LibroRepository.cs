using Biblioteca.Features.Libros;
using Biblioteca.Features.Libros.Model;
using Biblioteca.Features.Socios;
using Biblioteca.Features.Socios.Model;
using Biblioteca.Features.Prestamos;
using Biblioteca.Features.Prestamos.Model;
using Biblioteca.Features.Common.Exceptions;
using Biblioteca.Features.Common.Infrastructure;

using System.Collections.Generic;
using System.Threading.Tasks;

using Dapper;
using System.Data;

namespace Biblioteca.Features.Libros;

public class LibroRepository : ILibroRepository
{
    private readonly IDbConnection _connection;

    public LibroRepository(IDbConnection connection)
    {
        _connection = connection;
    }

    public async Task<Libro?> GetByIdAsync(int id)
    {
        var query = "SELECT Id, Titulo, Autor, ISBN as Isbn, CantidadDisponible FROM Libros WHERE Id = @Id";
        return await _connection.QueryFirstOrDefaultAsync<Libro>(query, new { Id = id });
    }

    public async Task<Libro?> GetByIsbnAsync(string isbn)
    {
        var query = "SELECT Id, Titulo, Autor, ISBN as Isbn, CantidadDisponible FROM Libros WHERE ISBN = @Isbn";
        return await _connection.QueryFirstOrDefaultAsync<Libro>(query, new { Isbn = isbn });
    }

    public async Task<IEnumerable<Libro>> GetAllAsync(LibroQueryFilter filter)
    {
        var where = new List<string>();
        var parameters = new DynamicParameters();

        if (!string.IsNullOrWhiteSpace(filter.Titulo))
        {
            where.Add("Titulo LIKE @Titulo");
            parameters.Add("Titulo", $"%{filter.Titulo}%");
        }

        if (!string.IsNullOrWhiteSpace(filter.Autor))
        {
            where.Add("Autor LIKE @Autor");
            parameters.Add("Autor", $"%{filter.Autor}%");
        }

        if (filter.CantidadMin.HasValue)
        {
            where.Add("CantidadDisponible >= @CantidadMin");
            parameters.Add("CantidadMin", filter.CantidadMin);
        }

        if (filter.CantidadMax.HasValue)
        {
            where.Add("CantidadDisponible <= @CantidadMax");
            parameters.Add("CantidadMax", filter.CantidadMax);
        }

        var query = """

                            SELECT Id,
                                   Titulo,
                                   Autor,
                                   ISBN AS Isbn,
                                   CantidadDisponible
                            FROM Libros
                    """;

        if (where.Any())
        {
            query += " WHERE " + string.Join(" AND ", where);
        }

        return await _connection.QueryAsync<Libro>(query, parameters);
    }

    public async Task<int> CreateAsync(Libro libro)
    {
        var query = @"INSERT INTO Libros (Titulo, Autor, ISBN, CantidadDisponible) 
                      OUTPUT INSERTED.Id 
                      VALUES (@Titulo, @Autor, @Isbn, @CantidadDisponible)";
        return await _connection.ExecuteScalarAsync<int>(query, libro);
    }

    public async Task UpdateAsync(Libro libro)
    {
        var query = @"UPDATE Libros 
                      SET Titulo = @Titulo, Autor = @Autor, ISBN = @Isbn, CantidadDisponible = @CantidadDisponible 
                      WHERE Id = @Id";
        await _connection.ExecuteAsync(query, libro);
    }

    public async Task DeleteAsync(string isbn)
    {
        var query = "DELETE FROM Libros WHERE ISBN = @Isbn";
        await _connection.ExecuteAsync(query, new { Isbn = isbn });
    }
}
