using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Kairos.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddProductImages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "Products");

            migrationBuilder.CreateTable(
                name: "ProductImages",
                columns: table => new
                {
                    ProductImageId = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductId = table.Column<long>(type: "bigint", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductImages", x => x.ProductImageId);
                    table.ForeignKey(
                        name: "FK_ProductImages_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "ProductId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "ProductImages",
                columns: new[] { "ProductImageId", "ImageUrl", "ProductId", "SortOrder" },
                values: new object[,]
                {
                    { 1L, "https://cdn.dummyjson.com/product-images/womens-dresses/black-women's-gown/thumbnail.webp", 1L, 0 },
                    { 2L, "https://cdn.dummyjson.com/product-images/womens-dresses/black-women's-gown/1.webp", 1L, 1 },
                    { 3L, "https://cdn.dummyjson.com/product-images/womens-dresses/corset-leather-with-skirt/thumbnail.webp", 2L, 0 },
                    { 4L, "https://cdn.dummyjson.com/product-images/womens-dresses/corset-with-black-skirt/thumbnail.webp", 3L, 0 },
                    { 5L, "https://cdn.dummyjson.com/product-images/womens-dresses/dress-pea/thumbnail.webp", 4L, 0 },
                    { 6L, "https://cdn.dummyjson.com/product-images/womens-dresses/marni-red-&-black-suit/thumbnail.webp", 5L, 0 },
                    { 7L, "https://cdn.dummyjson.com/product-images/tops/blue-frock/thumbnail.webp", 6L, 0 },
                    { 8L, "https://cdn.dummyjson.com/product-images/tops/girl-summer-dress/thumbnail.webp", 7L, 0 },
                    { 9L, "https://cdn.dummyjson.com/product-images/tops/gray-dress/thumbnail.webp", 8L, 0 },
                    { 10L, "https://cdn.dummyjson.com/product-images/tops/short-frock/thumbnail.webp", 9L, 0 },
                    { 11L, "https://cdn.dummyjson.com/product-images/tops/tartan-dress/thumbnail.webp", 10L, 0 },
                    { 12L, "https://cdn.dummyjson.com/product-images/womens-shoes/black-&-brown-slipper/thumbnail.webp", 11L, 0 },
                    { 13L, "https://cdn.dummyjson.com/product-images/womens-shoes/calvin-klein-heel-shoes/thumbnail.webp", 12L, 0 },
                    { 14L, "https://cdn.dummyjson.com/product-images/womens-shoes/golden-shoes-woman/thumbnail.webp", 13L, 0 },
                    { 15L, "https://cdn.dummyjson.com/product-images/womens-shoes/pampi-shoes/thumbnail.webp", 14L, 0 },
                    { 16L, "https://cdn.dummyjson.com/product-images/womens-shoes/red-shoes/thumbnail.webp", 15L, 0 },
                    { 17L, "https://cdn.dummyjson.com/product-images/womens-bags/blue-women's-handbag/thumbnail.webp", 16L, 0 },
                    { 18L, "https://cdn.dummyjson.com/product-images/womens-bags/heshe-women's-leather-bag/thumbnail.webp", 17L, 0 },
                    { 19L, "https://cdn.dummyjson.com/product-images/womens-bags/prada-women-bag/thumbnail.webp", 18L, 0 },
                    { 20L, "https://cdn.dummyjson.com/product-images/womens-bags/prada-women-bag/1.webp", 18L, 1 },
                    { 21L, "https://cdn.dummyjson.com/product-images/womens-bags/white-faux-leather-backpack/thumbnail.webp", 19L, 0 },
                    { 22L, "https://cdn.dummyjson.com/product-images/womens-bags/women-handbag-black/thumbnail.webp", 20L, 0 },
                    { 23L, "https://cdn.dummyjson.com/product-images/womens-jewellery/green-crystal-earring/thumbnail.webp", 21L, 0 },
                    { 24L, "https://cdn.dummyjson.com/product-images/womens-jewellery/green-oval-earring/thumbnail.webp", 22L, 0 },
                    { 25L, "https://cdn.dummyjson.com/product-images/womens-jewellery/tropical-earring/thumbnail.webp", 23L, 0 },
                    { 26L, "https://cdn.dummyjson.com/product-images/sunglasses/black-sun-glasses/thumbnail.webp", 24L, 0 },
                    { 27L, "https://cdn.dummyjson.com/product-images/sunglasses/black-sun-glasses/1.webp", 24L, 1 },
                    { 28L, "https://cdn.dummyjson.com/product-images/sunglasses/classic-sun-glasses/thumbnail.webp", 25L, 0 },
                    { 29L, "https://cdn.dummyjson.com/product-images/sunglasses/green-and-black-glasses/thumbnail.webp", 26L, 0 },
                    { 30L, "https://cdn.dummyjson.com/product-images/sunglasses/party-glasses/thumbnail.webp", 27L, 0 },
                    { 31L, "https://cdn.dummyjson.com/product-images/sunglasses/sunglasses/thumbnail.webp", 28L, 0 },
                    { 32L, "https://cdn.dummyjson.com/product-images/mens-shirts/blue-&-black-check-shirt/thumbnail.webp", 29L, 0 },
                    { 33L, "https://cdn.dummyjson.com/product-images/mens-shirts/gigabyte-aorus-men-tshirt/thumbnail.webp", 30L, 0 },
                    { 34L, "https://cdn.dummyjson.com/product-images/mens-shirts/man-plaid-shirt/thumbnail.webp", 31L, 0 },
                    { 35L, "https://cdn.dummyjson.com/product-images/mens-shirts/man-short-sleeve-shirt/thumbnail.webp", 32L, 0 },
                    { 36L, "https://cdn.dummyjson.com/product-images/mens-shirts/men-check-shirt/thumbnail.webp", 33L, 0 },
                    { 37L, "https://cdn.dummyjson.com/product-images/mens-shoes/nike-air-jordan-1-red-and-black/thumbnail.webp", 34L, 0 },
                    { 38L, "https://cdn.dummyjson.com/product-images/mens-shoes/nike-air-jordan-1-red-and-black/1.webp", 34L, 1 },
                    { 39L, "https://cdn.dummyjson.com/product-images/mens-shoes/nike-baseball-cleats/thumbnail.webp", 35L, 0 },
                    { 40L, "https://cdn.dummyjson.com/product-images/mens-shoes/puma-future-rider-trainers/thumbnail.webp", 36L, 0 },
                    { 41L, "https://cdn.dummyjson.com/product-images/mens-shoes/sports-sneakers-off-white-&-red/thumbnail.webp", 37L, 0 },
                    { 42L, "https://cdn.dummyjson.com/product-images/mens-shoes/sports-sneakers-off-white-red/thumbnail.webp", 38L, 0 },
                    { 43L, "https://cdn.dummyjson.com/product-images/mens-watches/brown-leather-belt-watch/thumbnail.webp", 39L, 0 },
                    { 44L, "https://cdn.dummyjson.com/product-images/mens-watches/longines-master-collection/thumbnail.webp", 40L, 0 },
                    { 45L, "https://cdn.dummyjson.com/product-images/mens-watches/rolex-cellini-date-black-dial/thumbnail.webp", 41L, 0 },
                    { 46L, "https://cdn.dummyjson.com/product-images/mens-watches/rolex-cellini-date-black-dial/1.webp", 41L, 1 },
                    { 47L, "https://cdn.dummyjson.com/product-images/mens-watches/rolex-cellini-moonphase/thumbnail.webp", 42L, 0 },
                    { 48L, "https://cdn.dummyjson.com/product-images/mens-watches/rolex-datejust/thumbnail.webp", 43L, 0 },
                    { 49L, "https://cdn.dummyjson.com/product-images/mens-watches/rolex-submariner-watch/thumbnail.webp", 44L, 0 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProductImages_ProductId_SortOrder",
                table: "ProductImages",
                columns: new[] { "ProductId", "SortOrder" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProductImages");

            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "Products",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 1L,
                column: "ImageUrl",
                value: "https://cdn.dummyjson.com/product-images/womens-dresses/black-women's-gown/thumbnail.webp");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 2L,
                column: "ImageUrl",
                value: "https://cdn.dummyjson.com/product-images/womens-dresses/corset-leather-with-skirt/thumbnail.webp");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 3L,
                column: "ImageUrl",
                value: "https://cdn.dummyjson.com/product-images/womens-dresses/corset-with-black-skirt/thumbnail.webp");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 4L,
                column: "ImageUrl",
                value: "https://cdn.dummyjson.com/product-images/womens-dresses/dress-pea/thumbnail.webp");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 5L,
                column: "ImageUrl",
                value: "https://cdn.dummyjson.com/product-images/womens-dresses/marni-red-&-black-suit/thumbnail.webp");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 6L,
                column: "ImageUrl",
                value: "https://cdn.dummyjson.com/product-images/tops/blue-frock/thumbnail.webp");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 7L,
                column: "ImageUrl",
                value: "https://cdn.dummyjson.com/product-images/tops/girl-summer-dress/thumbnail.webp");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 8L,
                column: "ImageUrl",
                value: "https://cdn.dummyjson.com/product-images/tops/gray-dress/thumbnail.webp");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 9L,
                column: "ImageUrl",
                value: "https://cdn.dummyjson.com/product-images/tops/short-frock/thumbnail.webp");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 10L,
                column: "ImageUrl",
                value: "https://cdn.dummyjson.com/product-images/tops/tartan-dress/thumbnail.webp");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 11L,
                column: "ImageUrl",
                value: "https://cdn.dummyjson.com/product-images/womens-shoes/black-&-brown-slipper/thumbnail.webp");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 12L,
                column: "ImageUrl",
                value: "https://cdn.dummyjson.com/product-images/womens-shoes/calvin-klein-heel-shoes/thumbnail.webp");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 13L,
                column: "ImageUrl",
                value: "https://cdn.dummyjson.com/product-images/womens-shoes/golden-shoes-woman/thumbnail.webp");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 14L,
                column: "ImageUrl",
                value: "https://cdn.dummyjson.com/product-images/womens-shoes/pampi-shoes/thumbnail.webp");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 15L,
                column: "ImageUrl",
                value: "https://cdn.dummyjson.com/product-images/womens-shoes/red-shoes/thumbnail.webp");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 16L,
                column: "ImageUrl",
                value: "https://cdn.dummyjson.com/product-images/womens-bags/blue-women's-handbag/thumbnail.webp");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 17L,
                column: "ImageUrl",
                value: "https://cdn.dummyjson.com/product-images/womens-bags/heshe-women's-leather-bag/thumbnail.webp");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 18L,
                column: "ImageUrl",
                value: "https://cdn.dummyjson.com/product-images/womens-bags/prada-women-bag/thumbnail.webp");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 19L,
                column: "ImageUrl",
                value: "https://cdn.dummyjson.com/product-images/womens-bags/white-faux-leather-backpack/thumbnail.webp");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 20L,
                column: "ImageUrl",
                value: "https://cdn.dummyjson.com/product-images/womens-bags/women-handbag-black/thumbnail.webp");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 21L,
                column: "ImageUrl",
                value: "https://cdn.dummyjson.com/product-images/womens-jewellery/green-crystal-earring/thumbnail.webp");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 22L,
                column: "ImageUrl",
                value: "https://cdn.dummyjson.com/product-images/womens-jewellery/green-oval-earring/thumbnail.webp");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 23L,
                column: "ImageUrl",
                value: "https://cdn.dummyjson.com/product-images/womens-jewellery/tropical-earring/thumbnail.webp");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 24L,
                column: "ImageUrl",
                value: "https://cdn.dummyjson.com/product-images/sunglasses/black-sun-glasses/thumbnail.webp");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 25L,
                column: "ImageUrl",
                value: "https://cdn.dummyjson.com/product-images/sunglasses/classic-sun-glasses/thumbnail.webp");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 26L,
                column: "ImageUrl",
                value: "https://cdn.dummyjson.com/product-images/sunglasses/green-and-black-glasses/thumbnail.webp");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 27L,
                column: "ImageUrl",
                value: "https://cdn.dummyjson.com/product-images/sunglasses/party-glasses/thumbnail.webp");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 28L,
                column: "ImageUrl",
                value: "https://cdn.dummyjson.com/product-images/sunglasses/sunglasses/thumbnail.webp");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 29L,
                column: "ImageUrl",
                value: "https://cdn.dummyjson.com/product-images/mens-shirts/blue-&-black-check-shirt/thumbnail.webp");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 30L,
                column: "ImageUrl",
                value: "https://cdn.dummyjson.com/product-images/mens-shirts/gigabyte-aorus-men-tshirt/thumbnail.webp");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 31L,
                column: "ImageUrl",
                value: "https://cdn.dummyjson.com/product-images/mens-shirts/man-plaid-shirt/thumbnail.webp");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 32L,
                column: "ImageUrl",
                value: "https://cdn.dummyjson.com/product-images/mens-shirts/man-short-sleeve-shirt/thumbnail.webp");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 33L,
                column: "ImageUrl",
                value: "https://cdn.dummyjson.com/product-images/mens-shirts/men-check-shirt/thumbnail.webp");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 34L,
                column: "ImageUrl",
                value: "https://cdn.dummyjson.com/product-images/mens-shoes/nike-air-jordan-1-red-and-black/thumbnail.webp");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 35L,
                column: "ImageUrl",
                value: "https://cdn.dummyjson.com/product-images/mens-shoes/nike-baseball-cleats/thumbnail.webp");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 36L,
                column: "ImageUrl",
                value: "https://cdn.dummyjson.com/product-images/mens-shoes/puma-future-rider-trainers/thumbnail.webp");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 37L,
                column: "ImageUrl",
                value: "https://cdn.dummyjson.com/product-images/mens-shoes/sports-sneakers-off-white-&-red/thumbnail.webp");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 38L,
                column: "ImageUrl",
                value: "https://cdn.dummyjson.com/product-images/mens-shoes/sports-sneakers-off-white-red/thumbnail.webp");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 39L,
                column: "ImageUrl",
                value: "https://cdn.dummyjson.com/product-images/mens-watches/brown-leather-belt-watch/thumbnail.webp");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 40L,
                column: "ImageUrl",
                value: "https://cdn.dummyjson.com/product-images/mens-watches/longines-master-collection/thumbnail.webp");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 41L,
                column: "ImageUrl",
                value: "https://cdn.dummyjson.com/product-images/mens-watches/rolex-cellini-date-black-dial/thumbnail.webp");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 42L,
                column: "ImageUrl",
                value: "https://cdn.dummyjson.com/product-images/mens-watches/rolex-cellini-moonphase/thumbnail.webp");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 43L,
                column: "ImageUrl",
                value: "https://cdn.dummyjson.com/product-images/mens-watches/rolex-datejust/thumbnail.webp");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 44L,
                column: "ImageUrl",
                value: "https://cdn.dummyjson.com/product-images/mens-watches/rolex-submariner-watch/thumbnail.webp");
        }
    }
}
