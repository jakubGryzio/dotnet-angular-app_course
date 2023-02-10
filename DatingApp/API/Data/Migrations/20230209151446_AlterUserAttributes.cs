using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class AlterUserAttributes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "KnowAs",
                table: "Users");

            migrationBuilder.RenameColumn(
                name: "UserEmail",
                table: "Users",
                newName: "KnownAs");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "KnownAs",
                table: "Users",
                newName: "UserEmail");

            migrationBuilder.AddColumn<string>(
                name: "KnowAs",
                table: "Users",
                type: "TEXT",
                nullable: true);
        }
    }
}
