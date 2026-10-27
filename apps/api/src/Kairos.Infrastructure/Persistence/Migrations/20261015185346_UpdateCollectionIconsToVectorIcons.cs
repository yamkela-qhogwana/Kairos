using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Kairos.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class UpdateCollectionIconsToVectorIcons : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Collections",
                keyColumn: "CollectionId",
                keyValue: (byte)1,
                column: "Icon",
                value: "star-outline");

            migrationBuilder.UpdateData(
                table: "Collections",
                keyColumn: "CollectionId",
                keyValue: (byte)2,
                column: "Icon",
                value: "diamond-stone");

            migrationBuilder.UpdateData(
                table: "Collections",
                keyColumn: "CollectionId",
                keyValue: (byte)3,
                column: "Icon",
                value: "tag-outline");

            migrationBuilder.UpdateData(
                table: "Collections",
                keyColumn: "CollectionId",
                keyValue: (byte)4,
                column: "Icon",
                value: "gift-outline");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
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
    }
}
