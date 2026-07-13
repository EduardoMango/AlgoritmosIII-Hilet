using System.Reflection;
using DbUp;
using FluentMigrator.Runner;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// =========================================================================
// MODO 1: CONFIGURACIÓN DE SERVICIOS - FLUENTMIGRATOR
// =========================================================================

// builder.Services.AddFluentMigratorCore()
//     .ConfigureRunner(rb => rb
//         .AddSqlServer2016() // Configuración nativa para SQL Server
//         .WithGlobalConnectionString(connectionString)
//         .ScanIn(Assembly.GetExecutingAssembly()).For.Migrations())
//     .AddLogging(lb => lb.AddFluentMigratorConsole());



var app = builder.Build();

// =========================================================================
// MODO 1: EJECUCIÓN DEL RUNNER - FLUENTMIGRATOR
// =========================================================================

// using (var scope = app.Services.CreateScope())
// {
//     var runner = scope.ServiceProvider.GetRequiredService<IMigrationRunner>();
//     runner.MigrateUp();
// }


// =========================================================================
// MODO 2: CONFIGURACIÓN Y EJECUCIÓN - DBUP
// =========================================================================

// EnsureDatabase.For.SqlDatabase(connectionString);
//
// var upgradeEngine = DeployChanges.To
//     .SqlDatabase(connectionString) // Conexión nativa a SQL Server
//     .WithScriptsEmbeddedInAssembly(Assembly.GetExecutingAssembly(), name => name.StartsWith("Migraciones.ScriptsDbUp."))
//     .LogToConsole()
//     .Build();
//
// var result = upgradeEngine.PerformUpgrade();
//
// if (!result.Successful)
// {
//     throw new InvalidOperationException($"Error en la ejecución de DbUp: {result.Error}");
// }


app.UseHttpsRedirection();



app.Run();
