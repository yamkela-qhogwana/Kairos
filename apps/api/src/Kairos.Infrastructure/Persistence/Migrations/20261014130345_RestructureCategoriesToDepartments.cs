using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Kairos.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class RestructureCategoriesToDepartments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: (byte)1,
                columns: new[] { "Name", "Slug" },
                values: new object[] { "Men's", "mens" });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: (byte)2,
                columns: new[] { "Name", "Slug" },
                values: new object[] { "Women's", "womens" });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: (byte)3,
                columns: new[] { "Name", "Slug" },
                values: new object[] { "Beauty", "beauty" });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: (byte)4,
                columns: new[] { "Name", "Slug" },
                values: new object[] { "Home", "home" });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: (byte)5,
                columns: new[] { "Name", "Slug" },
                values: new object[] { "Kids", "kids" });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: (byte)6,
                columns: new[] { "Name", "Slug" },
                values: new object[] { "Office", "office" });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: (byte)7,
                columns: new[] { "Name", "Slug" },
                values: new object[] { "Electronics", "electronics" });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: (byte)8,
                columns: new[] { "Name", "Slug" },
                values: new object[] { "Curve", "curve" });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: (byte)9,
                columns: new[] { "Name", "Slug" },
                values: new object[] { "Jewelry", "jewelry" });

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "CategoryId", "IsActive", "Name", "Slug" },
                values: new object[,]
                {
                    { (byte)10, true, "Sports", "sports" },
                    { (byte)11, true, "Bags", "bags" },
                    { (byte)12, true, "Toys", "toys" },
                    { (byte)13, true, "Seasonal", "seasonal" }
                });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 1L,
                column: "CategoryId",
                value: (byte)2);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 2L,
                column: "CategoryId",
                value: (byte)2);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 3L,
                column: "CategoryId",
                value: (byte)2);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 4L,
                column: "CategoryId",
                value: (byte)2);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 5L,
                column: "CategoryId",
                value: (byte)2);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 11L,
                column: "CategoryId",
                value: (byte)2);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 12L,
                column: "CategoryId",
                value: (byte)2);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 13L,
                column: "CategoryId",
                value: (byte)2);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 14L,
                column: "CategoryId",
                value: (byte)2);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 15L,
                column: "CategoryId",
                value: (byte)2);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 16L,
                column: "CategoryId",
                value: (byte)11);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 17L,
                column: "CategoryId",
                value: (byte)11);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 18L,
                column: "CategoryId",
                value: (byte)11);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 19L,
                column: "CategoryId",
                value: (byte)11);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 20L,
                column: "CategoryId",
                value: (byte)11);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 21L,
                column: "CategoryId",
                value: (byte)9);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 22L,
                column: "CategoryId",
                value: (byte)9);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 23L,
                column: "CategoryId",
                value: (byte)9);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 24L,
                column: "CategoryId",
                value: (byte)2);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 25L,
                column: "CategoryId",
                value: (byte)2);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 26L,
                column: "CategoryId",
                value: (byte)2);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 27L,
                column: "CategoryId",
                value: (byte)2);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 28L,
                column: "CategoryId",
                value: (byte)2);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 29L,
                column: "CategoryId",
                value: (byte)1);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 30L,
                column: "CategoryId",
                value: (byte)1);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 31L,
                column: "CategoryId",
                value: (byte)1);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 32L,
                column: "CategoryId",
                value: (byte)1);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 33L,
                column: "CategoryId",
                value: (byte)1);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 34L,
                column: "CategoryId",
                value: (byte)1);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 35L,
                column: "CategoryId",
                value: (byte)1);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 36L,
                column: "CategoryId",
                value: (byte)1);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 37L,
                column: "CategoryId",
                value: (byte)1);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 38L,
                column: "CategoryId",
                value: (byte)1);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 39L,
                column: "CategoryId",
                value: (byte)1);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 40L,
                column: "CategoryId",
                value: (byte)1);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 41L,
                column: "CategoryId",
                value: (byte)1);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 42L,
                column: "CategoryId",
                value: (byte)1);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 43L,
                column: "CategoryId",
                value: (byte)1);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 44L,
                column: "CategoryId",
                value: (byte)1);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: (byte)10);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: (byte)11);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: (byte)12);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: (byte)13);

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: (byte)1,
                columns: new[] { "Name", "Slug" },
                values: new object[] { "Dresses", "womens-dresses" });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: (byte)2,
                columns: new[] { "Name", "Slug" },
                values: new object[] { "Tops", "tops" });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: (byte)3,
                columns: new[] { "Name", "Slug" },
                values: new object[] { "Women's Shoes", "womens-shoes" });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: (byte)4,
                columns: new[] { "Name", "Slug" },
                values: new object[] { "Bags", "womens-bags" });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: (byte)5,
                columns: new[] { "Name", "Slug" },
                values: new object[] { "Jewellery", "womens-jewellery" });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: (byte)6,
                columns: new[] { "Name", "Slug" },
                values: new object[] { "Sunglasses", "sunglasses" });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: (byte)7,
                columns: new[] { "Name", "Slug" },
                values: new object[] { "Men's Shirts", "mens-shirts" });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: (byte)8,
                columns: new[] { "Name", "Slug" },
                values: new object[] { "Men's Shoes", "mens-shoes" });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: (byte)9,
                columns: new[] { "Name", "Slug" },
                values: new object[] { "Watches", "mens-watches" });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 1L,
                column: "CategoryId",
                value: (byte)1);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 2L,
                column: "CategoryId",
                value: (byte)1);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 3L,
                column: "CategoryId",
                value: (byte)1);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 4L,
                column: "CategoryId",
                value: (byte)1);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 5L,
                column: "CategoryId",
                value: (byte)1);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 11L,
                column: "CategoryId",
                value: (byte)3);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 12L,
                column: "CategoryId",
                value: (byte)3);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 13L,
                column: "CategoryId",
                value: (byte)3);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 14L,
                column: "CategoryId",
                value: (byte)3);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 15L,
                column: "CategoryId",
                value: (byte)3);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 16L,
                column: "CategoryId",
                value: (byte)4);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 17L,
                column: "CategoryId",
                value: (byte)4);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 18L,
                column: "CategoryId",
                value: (byte)4);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 19L,
                column: "CategoryId",
                value: (byte)4);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 20L,
                column: "CategoryId",
                value: (byte)4);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 21L,
                column: "CategoryId",
                value: (byte)5);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 22L,
                column: "CategoryId",
                value: (byte)5);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 23L,
                column: "CategoryId",
                value: (byte)5);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 24L,
                column: "CategoryId",
                value: (byte)6);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 25L,
                column: "CategoryId",
                value: (byte)6);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 26L,
                column: "CategoryId",
                value: (byte)6);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 27L,
                column: "CategoryId",
                value: (byte)6);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 28L,
                column: "CategoryId",
                value: (byte)6);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 29L,
                column: "CategoryId",
                value: (byte)7);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 30L,
                column: "CategoryId",
                value: (byte)7);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 31L,
                column: "CategoryId",
                value: (byte)7);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 32L,
                column: "CategoryId",
                value: (byte)7);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 33L,
                column: "CategoryId",
                value: (byte)7);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 34L,
                column: "CategoryId",
                value: (byte)8);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 35L,
                column: "CategoryId",
                value: (byte)8);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 36L,
                column: "CategoryId",
                value: (byte)8);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 37L,
                column: "CategoryId",
                value: (byte)8);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 38L,
                column: "CategoryId",
                value: (byte)8);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 39L,
                column: "CategoryId",
                value: (byte)9);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 40L,
                column: "CategoryId",
                value: (byte)9);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 41L,
                column: "CategoryId",
                value: (byte)9);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 42L,
                column: "CategoryId",
                value: (byte)9);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 43L,
                column: "CategoryId",
                value: (byte)9);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 44L,
                column: "CategoryId",
                value: (byte)9);
        }
    }
}
