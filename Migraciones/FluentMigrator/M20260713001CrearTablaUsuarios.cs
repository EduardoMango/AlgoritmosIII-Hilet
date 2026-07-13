using FluentMigrator;

namespace Migraciones.FluentMigrator;

[Migration(20260713001)]
public class M20260712001CrearTablaUsuarios : Migration
{
 
    public override void Up()
    {
        Create.Table("Usuarios")
            .WithColumn("Id").AsInt32().PrimaryKey().Identity()
            .WithColumn("Nombre").AsString(100).NotNullable()
            .WithColumn("Email").AsString(150).Unique().NotNullable();
    }

    public override void Down()
    {
        Delete.Table("Usuarios");
    }
    
}