using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MediCoreAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddCabinetSettings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CabinetSettings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Adresse = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Telephone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SiteWeb = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Horaires = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NumeroOrdre = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MatriculeFiscal = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CabinetSettings", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CabinetSettings");
        }
    }
}
