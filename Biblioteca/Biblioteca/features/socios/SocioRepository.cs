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

namespace Biblioteca.Features.Socios;

public class SocioRepository : ISocioRepository
{
    private readonly IDbConnection _connection;

    public SocioRepository(IDbConnection connection)
    {
        _connection = connection;
    }

    public async Task<SocioEntity?> GetByIdAsync(int id)
    {
        var query = "SELECT Id, NombreCompleto, Email FROM Socios WHERE Id = @Id";
        return await _connection.QueryFirstOrDefaultAsync<SocioEntity>(query, new { Id = id });
    }

    public async Task<SocioEntity?> GetByEmailAsync(string email)
    {
        var query = "SELECT Id, NombreCompleto, Email FROM Socios WHERE Email = @Email";
        return await _connection.QueryFirstOrDefaultAsync<SocioEntity>(query, new { Email = email });
    }

    public async Task<IEnumerable<SocioEntity>> GetAllAsync()
    {
        var query = "SELECT Id, NombreCompleto, Email FROM Socios";
        return await _connection.QueryAsync<SocioEntity>(query);
    }

    public async Task<int> CreateAsync(SocioEntity socioEntity)
    {
        var query = @"INSERT INTO Socios (NombreCompleto, Email) 
                      OUTPUT INSERTED.Id 
                      VALUES (@NombreCompleto, @Email)";
        return await _connection.ExecuteScalarAsync<int>(query, socioEntity);
    }
}
