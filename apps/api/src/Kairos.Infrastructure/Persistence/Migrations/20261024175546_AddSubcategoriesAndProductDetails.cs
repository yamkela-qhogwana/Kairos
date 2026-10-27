using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Kairos.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddSubcategoriesAndProductDetails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Sizes",
                table: "Products",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<byte>(
                name: "SubcategoryId",
                table: "Products",
                type: "tinyint",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Subcategories",
                columns: table => new
                {
                    SubcategoryId = table.Column<byte>(type: "tinyint", nullable: false),
                    CategoryId = table.Column<byte>(type: "tinyint", nullable: false),
                    Slug = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SortOrder = table.Column<byte>(type: "tinyint", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Subcategories", x => x.SubcategoryId);
                    table.ForeignKey(
                        name: "FK_Subcategories_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "CategoryId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 1L,
                columns: new[] { "Description", "Sizes", "SubcategoryId" },
                values: new object[] { "An elegant floor-length gown in black, finished with a tailored silhouette for evening occasions.", "XS,S,M,L,XL", (byte)1 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 2L,
                columns: new[] { "Description", "Sizes", "SubcategoryId" },
                values: new object[] { "A structured leather corset paired with a matching skirt for a bold, fitted look.", "XS,S,M,L,XL", (byte)2 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 3L,
                columns: new[] { "Description", "Sizes", "SubcategoryId" },
                values: new object[] { "A classic black corset top with a coordinating skirt, cinched at the waist.", "XS,S,M,L,XL", (byte)2 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 4L,
                columns: new[] { "Description", "Sizes", "SubcategoryId" },
                values: new object[] { "A soft pea-green dress with a relaxed fit, perfect for everyday wear.", "XS,S,M,L,XL", (byte)1 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 5L,
                columns: new[] { "Description", "Sizes", "SubcategoryId" },
                values: new object[] { "A striking red and black two-piece suit with sharp tailoring.", "XS,S,M,L,XL", (byte)2 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 6L,
                columns: new[] { "Description", "Sizes", "SubcategoryId" },
                values: new object[] { "A lightweight blue frock with a flattering A-line cut.", "XS,S,M,L,XL", (byte)1 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 7L,
                columns: new[] { "Description", "Sizes", "SubcategoryId" },
                values: new object[] { "A breezy summer dress in a light fabric, ideal for warm days.", "XS,S,M,L,XL", (byte)1 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 8L,
                columns: new[] { "Description", "Sizes", "SubcategoryId" },
                values: new object[] { "A versatile grey dress that moves easily from day to evening.", "XS,S,M,L,XL", (byte)1 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 9L,
                columns: new[] { "Description", "Sizes", "SubcategoryId" },
                values: new object[] { "A playful short frock with a fitted bodice and flared hem.", "XS,S,M,L,XL", (byte)1 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 10L,
                columns: new[] { "Description", "Sizes", "SubcategoryId" },
                values: new object[] { "A tartan-print dress with a nipped waist and classic collar.", "XS,S,M,L,XL", (byte)1 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 11L,
                columns: new[] { "Description", "Sizes", "SubcategoryId" },
                values: new object[] { "Soft slip-on slippers in a black and brown colourway.", "6,7,8,9,10,11", (byte)3 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 12L,
                columns: new[] { "Description", "Sizes", "SubcategoryId" },
                values: new object[] { "Pointed-toe heels from Calvin Klein with a sleek finish.", "6,7,8,9,10,11", (byte)3 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 13L,
                columns: new[] { "Description", "Sizes", "SubcategoryId" },
                values: new object[] { "Metallic gold heels designed to catch the light at any event.", "6,7,8,9,10,11", (byte)3 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 14L,
                columns: new[] { "Description", "Sizes", "SubcategoryId" },
                values: new object[] { "Comfortable everyday flats with a cushioned footbed.", "6,7,8,9,10,11", (byte)3 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 15L,
                columns: new[] { "Description", "Sizes", "SubcategoryId" },
                values: new object[] { "Statement red shoes with a rounded toe and block heel.", "6,7,8,9,10,11", (byte)3 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 16L,
                columns: new[] { "Description", "Sizes", "SubcategoryId" },
                values: new object[] { "A structured blue handbag with a top handle and adjustable strap.", "One Size", (byte)8 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 17L,
                columns: new[] { "Description", "Sizes", "SubcategoryId" },
                values: new object[] { "A genuine leather handbag from Heshe with a timeless silhouette.", "One Size", (byte)8 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 18L,
                columns: new[] { "Description", "Sizes", "SubcategoryId" },
                values: new object[] { "A premium Prada handbag crafted for everyday luxury.", "One Size", (byte)8 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 19L,
                columns: new[] { "Description", "Sizes", "SubcategoryId" },
                values: new object[] { "A white faux-leather backpack with padded straps for daily use.", "One Size", (byte)9 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 20L,
                columns: new[] { "Description", "Sizes", "SubcategoryId" },
                values: new object[] { "A classic black handbag with a roomy interior and secure zip closure.", "One Size", (byte)8 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 21L,
                columns: new[] { "Description", "Sizes", "SubcategoryId" },
                values: new object[] { "Crystal drop earrings in a rich emerald green.", "One Size", (byte)10 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 22L,
                columns: new[] { "Description", "Sizes", "SubcategoryId" },
                values: new object[] { "Oval-cut green stone earrings with a delicate gold-tone setting.", "One Size", (byte)10 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 23L,
                columns: new[] { "Description", "Sizes", "SubcategoryId" },
                values: new object[] { "Statement earrings with a tropical-inspired design.", "One Size", (byte)10 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 24L,
                columns: new[] { "Description", "Sizes", "SubcategoryId" },
                values: new object[] { "Classic black sunglasses with UV-protective lenses.", "One Size", (byte)4 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 25L,
                columns: new[] { "Description", "Sizes", "SubcategoryId" },
                values: new object[] { "Timeless sunglasses with a rounded frame.", "One Size", (byte)4 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 26L,
                columns: new[] { "Description", "Sizes", "SubcategoryId" },
                values: new object[] { "Two-tone sunglasses in green and black with a modern frame.", "One Size", (byte)4 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 27L,
                columns: new[] { "Description", "Sizes", "SubcategoryId" },
                values: new object[] { "Statement sunglasses with a bold frame, made for standing out.", "One Size", (byte)4 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 28L,
                columns: new[] { "Description", "Sizes", "SubcategoryId" },
                values: new object[] { "Everyday sunglasses with a lightweight frame.", "One Size", (byte)4 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 29L,
                columns: new[] { "Description", "Sizes", "SubcategoryId" },
                values: new object[] { "A checked shirt in blue and black, cut for a relaxed everyday fit.", "XS,S,M,L,XL", (byte)5 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 30L,
                columns: new[] { "Description", "Sizes", "SubcategoryId" },
                values: new object[] { "A graphic Aorus-branded t-shirt in soft cotton.", "XS,S,M,L,XL", (byte)5 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 31L,
                columns: new[] { "Description", "Sizes", "SubcategoryId" },
                values: new object[] { "A classic plaid shirt with a button-down collar.", "XS,S,M,L,XL", (byte)5 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 32L,
                columns: new[] { "Description", "Sizes", "SubcategoryId" },
                values: new object[] { "A lightweight short-sleeve shirt for warm-weather wear.", "XS,S,M,L,XL", (byte)5 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 33L,
                columns: new[] { "Description", "Sizes", "SubcategoryId" },
                values: new object[] { "A checked button-up shirt with a tailored fit.", "XS,S,M,L,XL", (byte)5 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 34L,
                columns: new[] { "Description", "Sizes", "SubcategoryId" },
                values: new object[] { "Iconic Air Jordan 1 sneakers in a red and black colourway.", "6,7,8,9,10,11,12", (byte)6 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 35L,
                columns: new[] { "Description", "Sizes", "SubcategoryId" },
                values: new object[] { "Performance baseball cleats built for grip and speed.", "6,7,8,9,10,11,12", (byte)6 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 36L,
                columns: new[] { "Description", "Sizes", "SubcategoryId" },
                values: new object[] { "Retro-styled Puma trainers with a cushioned sole.", "6,7,8,9,10,11,12", (byte)6 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 37L,
                columns: new[] { "Description", "Sizes", "SubcategoryId" },
                values: new object[] { "Lightweight sneakers in off-white and red, built for everyday training.", "6,7,8,9,10,11,12", (byte)6 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 38L,
                columns: new[] { "Description", "Sizes", "SubcategoryId" },
                values: new object[] { "A low-top sneaker in off-white with red accents.", "6,7,8,9,10,11,12", (byte)6 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 39L,
                columns: new[] { "Description", "Sizes", "SubcategoryId" },
                values: new object[] { "A classic watch with a brown leather strap and minimalist dial.", "One Size", (byte)7 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 40L,
                columns: new[] { "Description", "Sizes", "SubcategoryId" },
                values: new object[] { "A Longines Master Collection watch with a refined, understated face.", "One Size", (byte)7 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 41L,
                columns: new[] { "Description", "Sizes", "SubcategoryId" },
                values: new object[] { "A Rolex Cellini with a black dial and date function.", "One Size", (byte)7 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 42L,
                columns: new[] { "Description", "Sizes", "SubcategoryId" },
                values: new object[] { "A Rolex Cellini Moonphase with an intricate dial complication.", "One Size", (byte)7 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 43L,
                columns: new[] { "Description", "Sizes", "SubcategoryId" },
                values: new object[] { "A Rolex Datejust, the brand's most recognisable classic.", "One Size", (byte)7 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 44L,
                columns: new[] { "Description", "Sizes", "SubcategoryId" },
                values: new object[] { "A Rolex Submariner built for durability and timeless style.", "One Size", (byte)7 });

            migrationBuilder.InsertData(
                table: "Subcategories",
                columns: new[] { "SubcategoryId", "CategoryId", "IsActive", "Name", "Slug", "SortOrder" },
                values: new object[,]
                {
                    { (byte)1, (byte)2, true, "Dresses", "dresses", (byte)1 },
                    { (byte)2, (byte)2, true, "Suits & Corsets", "suits-corsets", (byte)2 },
                    { (byte)3, (byte)2, true, "Shoes", "shoes", (byte)3 },
                    { (byte)4, (byte)2, true, "Eyewear", "eyewear", (byte)4 },
                    { (byte)5, (byte)1, true, "Shirts & Tees", "shirts-tees", (byte)1 },
                    { (byte)6, (byte)1, true, "Footwear", "footwear", (byte)2 },
                    { (byte)7, (byte)1, true, "Watches", "watches", (byte)3 },
                    { (byte)8, (byte)11, true, "Handbags", "handbags", (byte)1 },
                    { (byte)9, (byte)11, true, "Backpacks", "backpacks", (byte)2 },
                    { (byte)10, (byte)9, true, "Earrings", "earrings", (byte)1 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Products_SubcategoryId",
                table: "Products",
                column: "SubcategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Subcategories_CategoryId",
                table: "Subcategories",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Subcategories_Slug",
                table: "Subcategories",
                column: "Slug",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Subcategories_SubcategoryId",
                table: "Products",
                column: "SubcategoryId",
                principalTable: "Subcategories",
                principalColumn: "SubcategoryId",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_Subcategories_SubcategoryId",
                table: "Products");

            migrationBuilder.DropTable(
                name: "Subcategories");

            migrationBuilder.DropIndex(
                name: "IX_Products_SubcategoryId",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Sizes",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "SubcategoryId",
                table: "Products");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 1L,
                column: "Description",
                value: null);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 2L,
                column: "Description",
                value: null);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 3L,
                column: "Description",
                value: null);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 4L,
                column: "Description",
                value: null);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 5L,
                column: "Description",
                value: null);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 6L,
                column: "Description",
                value: null);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 7L,
                column: "Description",
                value: null);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 8L,
                column: "Description",
                value: null);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 9L,
                column: "Description",
                value: null);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 10L,
                column: "Description",
                value: null);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 11L,
                column: "Description",
                value: null);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 12L,
                column: "Description",
                value: null);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 13L,
                column: "Description",
                value: null);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 14L,
                column: "Description",
                value: null);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 15L,
                column: "Description",
                value: null);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 16L,
                column: "Description",
                value: null);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 17L,
                column: "Description",
                value: null);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 18L,
                column: "Description",
                value: null);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 19L,
                column: "Description",
                value: null);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 20L,
                column: "Description",
                value: null);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 21L,
                column: "Description",
                value: null);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 22L,
                column: "Description",
                value: null);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 23L,
                column: "Description",
                value: null);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 24L,
                column: "Description",
                value: null);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 25L,
                column: "Description",
                value: null);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 26L,
                column: "Description",
                value: null);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 27L,
                column: "Description",
                value: null);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 28L,
                column: "Description",
                value: null);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 29L,
                column: "Description",
                value: null);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 30L,
                column: "Description",
                value: null);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 31L,
                column: "Description",
                value: null);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 32L,
                column: "Description",
                value: null);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 33L,
                column: "Description",
                value: null);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 34L,
                column: "Description",
                value: null);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 35L,
                column: "Description",
                value: null);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 36L,
                column: "Description",
                value: null);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 37L,
                column: "Description",
                value: null);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 38L,
                column: "Description",
                value: null);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 39L,
                column: "Description",
                value: null);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 40L,
                column: "Description",
                value: null);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 41L,
                column: "Description",
                value: null);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 42L,
                column: "Description",
                value: null);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 43L,
                column: "Description",
                value: null);

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 44L,
                column: "Description",
                value: null);
        }
    }
}
