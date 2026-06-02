using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MediCoreAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddUploadedBy : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UploadedBy",
                table: "PatientDocuments",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UploadedBy",
                table: "PatientDocuments");
        }
    }
}
