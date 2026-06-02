using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MediCoreAPI.Migrations
{
    /// <inheritdoc />
    public partial class CleanAllModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Avatar",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "DateNaissance",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "DoctorId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Online",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "PermPaiements",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "PermUrgences",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Age",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "Blood",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "BloodPressure",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "Contact",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "HeartRate",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "Spo2",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "Temperature",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "Diag",
                table: "Ordonnances");

            migrationBuilder.DropColumn(
                name: "Doctor",
                table: "Ordonnances");

            migrationBuilder.DropColumn(
                name: "Day",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "Month",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "Year",
                table: "Appointments");

            migrationBuilder.RenameColumn(
                name: "MedicalHistory",
                table: "Patients",
                newName: "Phone");

            migrationBuilder.RenameColumn(
                name: "Gender",
                table: "Patients",
                newName: "Email");

            migrationBuilder.RenameColumn(
                name: "Department",
                table: "Patients",
                newName: "Address");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Phone",
                table: "Patients",
                newName: "MedicalHistory");

            migrationBuilder.RenameColumn(
                name: "Email",
                table: "Patients",
                newName: "Gender");

            migrationBuilder.RenameColumn(
                name: "Address",
                table: "Patients",
                newName: "Department");

            migrationBuilder.AddColumn<string>(
                name: "Avatar",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DateNaissance",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DoctorId",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Online",
                table: "Users",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "PermPaiements",
                table: "Users",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "PermUrgences",
                table: "Users",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Age",
                table: "Patients",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Blood",
                table: "Patients",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BloodPressure",
                table: "Patients",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Contact",
                table: "Patients",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "HeartRate",
                table: "Patients",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Spo2",
                table: "Patients",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<double>(
                name: "Temperature",
                table: "Patients",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<string>(
                name: "Diag",
                table: "Ordonnances",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Doctor",
                table: "Ordonnances",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Day",
                table: "Appointments",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Month",
                table: "Appointments",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Year",
                table: "Appointments",
                type: "int",
                nullable: true);
        }
    }
}
