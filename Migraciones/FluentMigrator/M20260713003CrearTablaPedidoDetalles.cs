using FluentMigrator;

namespace Migraciones.FluentMigrator;

[Migration(20260713003)]
public class M20260713003CrearTablaPedidoDetalles : Migration
{
    public override void Up()
    {
        Create.Table("PedidoDetalles")
            .WithColumn("Id").AsInt32().PrimaryKey().Identity()
            .WithColumn("PedidoId").AsInt32().NotNullable()
            .WithColumn("Producto").AsString(150).NotNullable()
            .WithColumn("Cantidad").AsInt32().NotNullable()
            .WithColumn("PrecioUnitario").AsDecimal(18, 2).NotNullable();

        Create.ForeignKey("FK_PedidoDetalles_Pedidos")
            .FromTable("PedidoDetalles").ForeignColumn("PedidoId")
            .ToTable("Pedidos").PrimaryColumn("Id")
            .OnDelete(System.Data.Rule.Cascade);
    }

    public override void Down()
    {
        Delete.ForeignKey("FK_PedidoDetalles_Pedidos").OnTable("PedidoDetalles");
        Delete.Table("PedidoDetalles");
    } 
}