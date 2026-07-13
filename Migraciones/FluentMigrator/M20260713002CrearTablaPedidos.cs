using FluentMigrator;

namespace Migraciones.FluentMigrator;

[Migration(20260713002)]
public class M20260713002CrearTablaPedidos : Migration
{
    public override void Up()
    {
        Create.Table("Pedidos")
            .WithColumn("Id").AsInt32().PrimaryKey().Identity()
            .WithColumn("UsuarioId").AsInt32().NotNullable()
            .WithColumn("Fecha").AsDateTime().WithDefaultValue(SystemMethods.CurrentDateTime)
            .WithColumn("Total").AsDecimal(18, 2).NotNullable();

        Create.ForeignKey("FK_Pedidos_Usuarios")
            .FromTable("Pedidos").ForeignColumn("UsuarioId")
            .ToTable("Usuarios").PrimaryColumn("Id")
            .OnDelete(System.Data.Rule.Cascade);
    }

    public override void Down()
    {
        Delete.ForeignKey("FK_Pedidos_Usuarios").OnTable("Pedidos");
        Delete.Table("Pedidos");
    }   
}