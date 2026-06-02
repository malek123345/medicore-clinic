using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MediCoreAPI.Migrations
{
    /// <inheritdoc />
    public partial class CleanModelsUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GroupeSanguin",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Avatar",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "AvatarColor",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "Diag",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "FullName",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "Grad",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "Ini",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "LastVisit",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "LastVisitDate",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "Next",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "Nss",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "StatusCls",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "StatusLbl",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "Tel",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "TotalVisits",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "Dosage",
                table: "Ordonnances");

            migrationBuilder.DropColumn(
                name: "Duration",
                table: "Ordonnances");

            migrationBuilder.DropColumn(
                name: "Frequency",
                table: "Ordonnances");

            migrationBuilder.DropColumn(
                name: "Grad",
                table: "Ordonnances");

            migrationBuilder.DropColumn(
                name: "Ini",
                table: "Ordonnances");

            migrationBuilder.DropColumn(
                name: "Medication",
                table: "Ordonnances");

            migrationBuilder.DropColumn(
                name: "Patient",
                table: "Ordonnances");

            migrationBuilder.DropColumn(
                name: "PatientAvatar",
                table: "Ordonnances");

            migrationBuilder.DropColumn(
                name: "PatientAvatarColor",
                table: "Ordonnances");

            migrationBuilder.DropColumn(
                name: "StatusCls",
                table: "Ordonnances");

            migrationBuilder.DropColumn(
                name: "StatusLbl",
                table: "Ordonnances");

            migrationBuilder.DropColumn(
                name: "PatientAvatar",
                table: "Invoices");

            migrationBuilder.DropColumn(
                name: "PatientAvatarColor",
                table: "Invoices");

            migrationBuilder.DropColumn(
                name: "Ap",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "Av",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "AvGrad",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "Doctor",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "Mo",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "Notes",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "PatientAge",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "PatientAvatar",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "PatientAvatarColor",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "StatusCls",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "StatusLbl",
                table: "Appointments");

            migrationBuilder.AlterColumn<string>(
                name: "Avatar",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "Patients",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Age",
                table: "Patients",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Avatar",
                table: "Users",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GroupeSanguin",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "Patients",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Age",
                table: "Patients",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Avatar",
                table: "Patients",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AvatarColor",
                table: "Patients",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Diag",
                table: "Patients",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Patients",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FullName",
                table: "Patients",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Grad",
                table: "Patients",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Ini",
                table: "Patients",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LastVisit",
                table: "Patients",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LastVisitDate",
                table: "Patients",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Next",
                table: "Patients",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Nss",
                table: "Patients",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StatusCls",
                table: "Patients",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StatusLbl",
                table: "Patients",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Tel",
                table: "Patients",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TotalVisits",
                table: "Patients",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Dosage",
                table: "Ordonnances",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Duration",
                table: "Ordonnances",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Frequency",
                table: "Ordonnances",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Grad",
                table: "Ordonnances",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Ini",
                table: "Ordonnances",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Medication",
                table: "Ordonnances",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Patient",
                table: "Ordonnances",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PatientAvatar",
                table: "Ordonnances",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PatientAvatarColor",
                table: "Ordonnances",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StatusCls",
                table: "Ordonnances",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StatusLbl",
                table: "Ordonnances",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PatientAvatar",
                table: "Invoices",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PatientAvatarColor",
                table: "Invoices",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Ap",
                table: "Appointments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Av",
                table: "Appointments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AvGrad",
                table: "Appointments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Doctor",
                table: "Appointments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Mo",
                table: "Appointments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "Appointments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PatientAge",
                table: "Appointments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PatientAvatar",
                table: "Appointments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PatientAvatarColor",
                table: "Appointments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StatusCls",
                table: "Appointments",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StatusLbl",
                table: "Appointments",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
