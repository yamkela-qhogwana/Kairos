using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Kairos.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddCollectionIcon : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Icon",
                table: "Collections",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "Collections",
                keyColumn: "CollectionId",
                keyValue: (byte)1,
                column: "Icon",
                value: "🔥");

            migrationBuilder.UpdateData(
                table: "Collections",
                keyColumn: "CollectionId",
                keyValue: (byte)2,
                column: "Icon",
                value: "💎");

            migrationBuilder.UpdateData(
                table: "Collections",
                keyColumn: "CollectionId",
                keyValue: (byte)3,
                column: "Icon",
                value: "🏷️");

            migrationBuilder.UpdateData(
                table: "Collections",
                keyColumn: "CollectionId",
                keyValue: (byte)4,
                column: "Icon",
                value: "🎁");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Icon",
                table: "Collections");
        }
    }
}
