using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Kairos.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class SeparateProductSizesWithStock : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Sizes",
                table: "Products");

            migrationBuilder.CreateTable(
                name: "ProductSizes",
                columns: table => new
                {
                    ProductSizeId = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductId = table.Column<long>(type: "bigint", nullable: false),
                    Size = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductSizes", x => x.ProductSizeId);
                    table.ForeignKey(
                        name: "FK_ProductSizes_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "ProductId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "ProductSizes",
                columns: new[] { "ProductSizeId", "ProductId", "Quantity", "Size" },
                values: new object[,]
                {
                    { 1L, 1L, 20, "XS" },
                    { 2L, 1L, 20, "S" },
                    { 3L, 1L, 20, "M" },
                    { 4L, 1L, 20, "L" },
                    { 5L, 1L, 20, "XL" },
                    { 6L, 2L, 20, "XS" },
                    { 7L, 2L, 20, "S" },
                    { 8L, 2L, 20, "M" },
                    { 9L, 2L, 20, "L" },
                    { 10L, 2L, 20, "XL" },
                    { 11L, 3L, 20, "XS" },
                    { 12L, 3L, 20, "S" },
                    { 13L, 3L, 20, "M" },
                    { 14L, 3L, 20, "L" },
                    { 15L, 3L, 20, "XL" },
                    { 16L, 4L, 20, "XS" },
                    { 17L, 4L, 20, "S" },
                    { 18L, 4L, 20, "M" },
                    { 19L, 4L, 20, "L" },
                    { 20L, 4L, 20, "XL" },
                    { 21L, 5L, 20, "XS" },
                    { 22L, 5L, 20, "S" },
                    { 23L, 5L, 20, "M" },
                    { 24L, 5L, 20, "L" },
                    { 25L, 5L, 20, "XL" },
                    { 26L, 6L, 20, "XS" },
                    { 27L, 6L, 20, "S" },
                    { 28L, 6L, 20, "M" },
                    { 29L, 6L, 20, "L" },
                    { 30L, 6L, 20, "XL" },
                    { 31L, 7L, 20, "XS" },
                    { 32L, 7L, 20, "S" },
                    { 33L, 7L, 20, "M" },
                    { 34L, 7L, 20, "L" },
                    { 35L, 7L, 20, "XL" },
                    { 36L, 8L, 20, "XS" },
                    { 37L, 8L, 20, "S" },
                    { 38L, 8L, 20, "M" },
                    { 39L, 8L, 20, "L" },
                    { 40L, 8L, 20, "XL" },
                    { 41L, 9L, 20, "XS" },
                    { 42L, 9L, 20, "S" },
                    { 43L, 9L, 20, "M" },
                    { 44L, 9L, 20, "L" },
                    { 45L, 9L, 20, "XL" },
                    { 46L, 10L, 20, "XS" },
                    { 47L, 10L, 20, "S" },
                    { 48L, 10L, 20, "M" },
                    { 49L, 10L, 20, "L" },
                    { 50L, 10L, 20, "XL" },
                    { 51L, 11L, 20, "6" },
                    { 52L, 11L, 20, "7" },
                    { 53L, 11L, 20, "8" },
                    { 54L, 11L, 20, "9" },
                    { 55L, 11L, 20, "10" },
                    { 56L, 11L, 20, "11" },
                    { 57L, 12L, 20, "6" },
                    { 58L, 12L, 20, "7" },
                    { 59L, 12L, 20, "8" },
                    { 60L, 12L, 20, "9" },
                    { 61L, 12L, 20, "10" },
                    { 62L, 12L, 20, "11" },
                    { 63L, 13L, 20, "6" },
                    { 64L, 13L, 20, "7" },
                    { 65L, 13L, 20, "8" },
                    { 66L, 13L, 20, "9" },
                    { 67L, 13L, 20, "10" },
                    { 68L, 13L, 20, "11" },
                    { 69L, 14L, 20, "6" },
                    { 70L, 14L, 20, "7" },
                    { 71L, 14L, 20, "8" },
                    { 72L, 14L, 20, "9" },
                    { 73L, 14L, 20, "10" },
                    { 74L, 14L, 20, "11" },
                    { 75L, 15L, 20, "6" },
                    { 76L, 15L, 20, "7" },
                    { 77L, 15L, 20, "8" },
                    { 78L, 15L, 20, "9" },
                    { 79L, 15L, 20, "10" },
                    { 80L, 15L, 20, "11" },
                    { 81L, 16L, 20, "One Size" },
                    { 82L, 17L, 20, "One Size" },
                    { 83L, 18L, 20, "One Size" },
                    { 84L, 19L, 20, "One Size" },
                    { 85L, 20L, 20, "One Size" },
                    { 86L, 21L, 20, "One Size" },
                    { 87L, 22L, 20, "One Size" },
                    { 88L, 23L, 20, "One Size" },
                    { 89L, 24L, 20, "One Size" },
                    { 90L, 25L, 20, "One Size" },
                    { 91L, 26L, 20, "One Size" },
                    { 92L, 27L, 20, "One Size" },
                    { 93L, 28L, 20, "One Size" },
                    { 94L, 29L, 20, "XS" },
                    { 95L, 29L, 20, "S" },
                    { 96L, 29L, 20, "M" },
                    { 97L, 29L, 20, "L" },
                    { 98L, 29L, 20, "XL" },
                    { 99L, 30L, 20, "XS" },
                    { 100L, 30L, 20, "S" },
                    { 101L, 30L, 20, "M" },
                    { 102L, 30L, 20, "L" },
                    { 103L, 30L, 20, "XL" },
                    { 104L, 31L, 20, "XS" },
                    { 105L, 31L, 20, "S" },
                    { 106L, 31L, 20, "M" },
                    { 107L, 31L, 20, "L" },
                    { 108L, 31L, 20, "XL" },
                    { 109L, 32L, 20, "XS" },
                    { 110L, 32L, 20, "S" },
                    { 111L, 32L, 20, "M" },
                    { 112L, 32L, 20, "L" },
                    { 113L, 32L, 20, "XL" },
                    { 114L, 33L, 20, "XS" },
                    { 115L, 33L, 20, "S" },
                    { 116L, 33L, 20, "M" },
                    { 117L, 33L, 20, "L" },
                    { 118L, 33L, 20, "XL" },
                    { 119L, 34L, 20, "6" },
                    { 120L, 34L, 20, "7" },
                    { 121L, 34L, 20, "8" },
                    { 122L, 34L, 20, "9" },
                    { 123L, 34L, 20, "10" },
                    { 124L, 34L, 20, "11" },
                    { 125L, 34L, 20, "12" },
                    { 126L, 35L, 20, "6" },
                    { 127L, 35L, 20, "7" },
                    { 128L, 35L, 20, "8" },
                    { 129L, 35L, 20, "9" },
                    { 130L, 35L, 20, "10" },
                    { 131L, 35L, 20, "11" },
                    { 132L, 35L, 20, "12" },
                    { 133L, 36L, 20, "6" },
                    { 134L, 36L, 20, "7" },
                    { 135L, 36L, 20, "8" },
                    { 136L, 36L, 20, "9" },
                    { 137L, 36L, 20, "10" },
                    { 138L, 36L, 20, "11" },
                    { 139L, 36L, 20, "12" },
                    { 140L, 37L, 20, "6" },
                    { 141L, 37L, 20, "7" },
                    { 142L, 37L, 20, "8" },
                    { 143L, 37L, 20, "9" },
                    { 144L, 37L, 20, "10" },
                    { 145L, 37L, 20, "11" },
                    { 146L, 37L, 20, "12" },
                    { 147L, 38L, 20, "6" },
                    { 148L, 38L, 20, "7" },
                    { 149L, 38L, 20, "8" },
                    { 150L, 38L, 20, "9" },
                    { 151L, 38L, 20, "10" },
                    { 152L, 38L, 20, "11" },
                    { 153L, 38L, 20, "12" },
                    { 154L, 39L, 20, "One Size" },
                    { 155L, 40L, 20, "One Size" },
                    { 156L, 41L, 20, "One Size" },
                    { 157L, 42L, 20, "One Size" },
                    { 158L, 43L, 20, "One Size" },
                    { 159L, 44L, 20, "One Size" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProductSizes_ProductId_Size",
                table: "ProductSizes",
                columns: new[] { "ProductId", "Size" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProductSizes");

            migrationBuilder.AddColumn<string>(
                name: "Sizes",
                table: "Products",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 1L,
                column: "Sizes",
                value: "XS,S,M,L,XL");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 2L,
                column: "Sizes",
                value: "XS,S,M,L,XL");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 3L,
                column: "Sizes",
                value: "XS,S,M,L,XL");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 4L,
                column: "Sizes",
                value: "XS,S,M,L,XL");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 5L,
                column: "Sizes",
                value: "XS,S,M,L,XL");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 6L,
                column: "Sizes",
                value: "XS,S,M,L,XL");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 7L,
                column: "Sizes",
                value: "XS,S,M,L,XL");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 8L,
                column: "Sizes",
                value: "XS,S,M,L,XL");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 9L,
                column: "Sizes",
                value: "XS,S,M,L,XL");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 10L,
                column: "Sizes",
                value: "XS,S,M,L,XL");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 11L,
                column: "Sizes",
                value: "6,7,8,9,10,11");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 12L,
                column: "Sizes",
                value: "6,7,8,9,10,11");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 13L,
                column: "Sizes",
                value: "6,7,8,9,10,11");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 14L,
                column: "Sizes",
                value: "6,7,8,9,10,11");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 15L,
                column: "Sizes",
                value: "6,7,8,9,10,11");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 16L,
                column: "Sizes",
                value: "One Size");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 17L,
                column: "Sizes",
                value: "One Size");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 18L,
                column: "Sizes",
                value: "One Size");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 19L,
                column: "Sizes",
                value: "One Size");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 20L,
                column: "Sizes",
                value: "One Size");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 21L,
                column: "Sizes",
                value: "One Size");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 22L,
                column: "Sizes",
                value: "One Size");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 23L,
                column: "Sizes",
                value: "One Size");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 24L,
                column: "Sizes",
                value: "One Size");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 25L,
                column: "Sizes",
                value: "One Size");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 26L,
                column: "Sizes",
                value: "One Size");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 27L,
                column: "Sizes",
                value: "One Size");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 28L,
                column: "Sizes",
                value: "One Size");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 29L,
                column: "Sizes",
                value: "XS,S,M,L,XL");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 30L,
                column: "Sizes",
                value: "XS,S,M,L,XL");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 31L,
                column: "Sizes",
                value: "XS,S,M,L,XL");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 32L,
                column: "Sizes",
                value: "XS,S,M,L,XL");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 33L,
                column: "Sizes",
                value: "XS,S,M,L,XL");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 34L,
                column: "Sizes",
                value: "6,7,8,9,10,11,12");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 35L,
                column: "Sizes",
                value: "6,7,8,9,10,11,12");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 36L,
                column: "Sizes",
                value: "6,7,8,9,10,11,12");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 37L,
                column: "Sizes",
                value: "6,7,8,9,10,11,12");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 38L,
                column: "Sizes",
                value: "6,7,8,9,10,11,12");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 39L,
                column: "Sizes",
                value: "One Size");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 40L,
                column: "Sizes",
                value: "One Size");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 41L,
                column: "Sizes",
                value: "One Size");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 42L,
                column: "Sizes",
                value: "One Size");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 43L,
                column: "Sizes",
                value: "One Size");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 44L,
                column: "Sizes",
                value: "One Size");
        }
    }
}
