using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Kairos.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class SeedProducts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Stores",
                columns: new[] { "StoreId", "City", "CreatedAt", "IsActive", "Location", "Name", "OwnerUserId" },
                values: new object[] { 1L, "Johannesburg", new DateTime(2026, 9, 21, 0, 0, 0, 0, DateTimeKind.Utc), true, null, "Kairos Demo Store", null });

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "ProductId", "Category", "CreatedAt", "Description", "DiscountPercentage", "ImageUrl", "IsActive", "OriginalPrice", "Rating", "SaleId", "SalePrice", "StoreId", "Title" },
                values: new object[,]
                {
                    { 1L, "womens-dresses", new DateTime(2026, 9, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, 10, "https://cdn.dummyjson.com/product-images/womens-dresses/black-women's-gown/thumbnail.webp", true, 129.99m, 3.6400000000000001, null, 116.99m, 1L, "Black Women's Gown" },
                    { 2L, "womens-dresses", new DateTime(2026, 9, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, 16, "https://cdn.dummyjson.com/product-images/womens-dresses/corset-leather-with-skirt/thumbnail.webp", true, 89.99m, 3.0499999999999998, null, 75.59m, 1L, "Corset Leather With Skirt" },
                    { 3L, "womens-dresses", new DateTime(2026, 9, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, 15, "https://cdn.dummyjson.com/product-images/womens-dresses/corset-with-black-skirt/thumbnail.webp", true, 79.99m, 4.5199999999999996, null, 67.99m, 1L, "Corset With Black Skirt" },
                    { 4L, "womens-dresses", new DateTime(2026, 9, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, 18, "https://cdn.dummyjson.com/product-images/womens-dresses/dress-pea/thumbnail.webp", true, 49.99m, 4.8799999999999999, null, 40.99m, 1L, "Dress Pea" },
                    { 5L, "womens-dresses", new DateTime(2026, 9, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, 19, "https://cdn.dummyjson.com/product-images/womens-dresses/marni-red-&-black-suit/thumbnail.webp", true, 179.99m, 4.4800000000000004, null, 145.79m, 1L, "Marni Red & Black Suit" },
                    { 6L, "tops", new DateTime(2026, 9, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, 12, "https://cdn.dummyjson.com/product-images/tops/blue-frock/thumbnail.webp", true, 29.99m, 4.1699999999999999, null, 26.39m, 1L, "Blue Frock" },
                    { 7L, "tops", new DateTime(2026, 9, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, 19, "https://cdn.dummyjson.com/product-images/tops/girl-summer-dress/thumbnail.webp", true, 19.99m, 4.7699999999999996, null, 16.19m, 1L, "Girl Summer Dress" },
                    { 8L, "tops", new DateTime(2026, 9, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, 14, "https://cdn.dummyjson.com/product-images/tops/gray-dress/thumbnail.webp", true, 34.99m, 2.7200000000000002, null, 30.09m, 1L, "Gray Dress" },
                    { 9L, "tops", new DateTime(2026, 9, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, 13, "https://cdn.dummyjson.com/product-images/tops/short-frock/thumbnail.webp", true, 24.99m, 3.23, null, 21.74m, 1L, "Short Frock" },
                    { 10L, "tops", new DateTime(2026, 9, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, 13, "https://cdn.dummyjson.com/product-images/tops/tartan-dress/thumbnail.webp", true, 39.99m, 4.0499999999999998, null, 34.79m, 1L, "Tartan Dress" },
                    { 11L, "womens-shoes", new DateTime(2026, 9, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, 3, "https://cdn.dummyjson.com/product-images/womens-shoes/black-&-brown-slipper/thumbnail.webp", true, 19.99m, 2.5299999999999998, null, 19.39m, 1L, "Black & Brown Slipper" },
                    { 12L, "womens-shoes", new DateTime(2026, 9, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, 3, "https://cdn.dummyjson.com/product-images/womens-shoes/calvin-klein-heel-shoes/thumbnail.webp", true, 79.99m, 4.9199999999999999, null, 77.59m, 1L, "Calvin Klein Heel Shoes" },
                    { 13L, "womens-shoes", new DateTime(2026, 9, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, 14, "https://cdn.dummyjson.com/product-images/womens-shoes/golden-shoes-woman/thumbnail.webp", true, 49.99m, 3.2599999999999998, null, 42.99m, 1L, "Golden Shoes Woman" },
                    { 14L, "womens-shoes", new DateTime(2026, 9, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, 14, "https://cdn.dummyjson.com/product-images/womens-shoes/pampi-shoes/thumbnail.webp", true, 29.99m, 3.0499999999999998, null, 25.79m, 1L, "Pampi Shoes" },
                    { 15L, "womens-shoes", new DateTime(2026, 9, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, 18, "https://cdn.dummyjson.com/product-images/womens-shoes/red-shoes/thumbnail.webp", true, 34.99m, 3.25, null, 28.69m, 1L, "Red Shoes" },
                    { 16L, "womens-bags", new DateTime(2026, 9, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, 18, "https://cdn.dummyjson.com/product-images/womens-bags/blue-women's-handbag/thumbnail.webp", true, 49.99m, 2.9199999999999999, null, 40.99m, 1L, "Blue Women's Handbag" },
                    { 17L, "womens-bags", new DateTime(2026, 9, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, 4, "https://cdn.dummyjson.com/product-images/womens-bags/heshe-women's-leather-bag/thumbnail.webp", true, 129.99m, 4.9199999999999999, null, 124.79m, 1L, "Heshe Women's Leather Bag" },
                    { 18L, "womens-bags", new DateTime(2026, 9, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, 14, "https://cdn.dummyjson.com/product-images/womens-bags/prada-women-bag/thumbnail.webp", true, 599.99m, 2.71, null, 515.99m, 1L, "Prada Women Bag" },
                    { 19L, "womens-bags", new DateTime(2026, 9, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, 15, "https://cdn.dummyjson.com/product-images/womens-bags/white-faux-leather-backpack/thumbnail.webp", true, 39.99m, 3.3599999999999999, null, 33.99m, 1L, "White Faux Leather Backpack" },
                    { 20L, "womens-bags", new DateTime(2026, 9, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, 12, "https://cdn.dummyjson.com/product-images/womens-bags/women-handbag-black/thumbnail.webp", true, 59.99m, 2.8900000000000001, null, 52.79m, 1L, "Women Handbag Black" },
                    { 21L, "womens-jewellery", new DateTime(2026, 9, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, 15, "https://cdn.dummyjson.com/product-images/womens-jewellery/green-crystal-earring/thumbnail.webp", true, 29.99m, 3.96, null, 25.49m, 1L, "Green Crystal Earring" },
                    { 22L, "womens-jewellery", new DateTime(2026, 9, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, 15, "https://cdn.dummyjson.com/product-images/womens-jewellery/green-oval-earring/thumbnail.webp", true, 24.99m, 3.5699999999999998, null, 21.24m, 1L, "Green Oval Earring" },
                    { 23L, "womens-jewellery", new DateTime(2026, 9, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, 1, "https://cdn.dummyjson.com/product-images/womens-jewellery/tropical-earring/thumbnail.webp", true, 19.99m, 4.4000000000000004, null, 19.79m, 1L, "Tropical Earring" },
                    { 24L, "sunglasses", new DateTime(2026, 9, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, 5, "https://cdn.dummyjson.com/product-images/sunglasses/black-sun-glasses/thumbnail.webp", true, 29.99m, 4.4100000000000001, null, 28.49m, 1L, "Black Sun Glasses" },
                    { 25L, "sunglasses", new DateTime(2026, 9, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, 5, "https://cdn.dummyjson.com/product-images/sunglasses/classic-sun-glasses/thumbnail.webp", true, 24.99m, 3.8599999999999999, null, 23.74m, 1L, "Classic Sun Glasses" },
                    { 26L, "sunglasses", new DateTime(2026, 9, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, 1, "https://cdn.dummyjson.com/product-images/sunglasses/green-and-black-glasses/thumbnail.webp", true, 34.99m, 4.5499999999999998, null, 34.64m, 1L, "Green and Black Glasses" },
                    { 27L, "sunglasses", new DateTime(2026, 9, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, 11, "https://cdn.dummyjson.com/product-images/sunglasses/party-glasses/thumbnail.webp", true, 19.99m, 2.79, null, 17.79m, 1L, "Party Glasses" },
                    { 28L, "sunglasses", new DateTime(2026, 9, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, 2, "https://cdn.dummyjson.com/product-images/sunglasses/sunglasses/thumbnail.webp", true, 22.99m, 3.02, null, 22.53m, 1L, "Sunglasses" },
                    { 29L, "mens-shirts", new DateTime(2026, 9, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, 15, "https://cdn.dummyjson.com/product-images/mens-shirts/blue-&-black-check-shirt/thumbnail.webp", true, 29.99m, 3.6400000000000001, null, 25.49m, 1L, "Blue & Black Check Shirt" },
                    { 30L, "mens-shirts", new DateTime(2026, 9, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, 1, "https://cdn.dummyjson.com/product-images/mens-shirts/gigabyte-aorus-men-tshirt/thumbnail.webp", true, 24.99m, 3.1800000000000002, null, 24.74m, 1L, "Gigabyte Aorus Men Tshirt" },
                    { 31L, "mens-shirts", new DateTime(2026, 9, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, 20, "https://cdn.dummyjson.com/product-images/mens-shirts/man-plaid-shirt/thumbnail.webp", true, 34.99m, 3.46, null, 27.99m, 1L, "Man Plaid Shirt" },
                    { 32L, "mens-shirts", new DateTime(2026, 9, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, 7, "https://cdn.dummyjson.com/product-images/mens-shirts/man-short-sleeve-shirt/thumbnail.webp", true, 19.99m, 2.8999999999999999, null, 18.59m, 1L, "Man Short Sleeve Shirt" },
                    { 33L, "mens-shirts", new DateTime(2026, 9, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, 11, "https://cdn.dummyjson.com/product-images/mens-shirts/men-check-shirt/thumbnail.webp", true, 27.99m, 2.7200000000000002, null, 24.91m, 1L, "Men Check Shirt" },
                    { 34L, "mens-shoes", new DateTime(2026, 9, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, 4, "https://cdn.dummyjson.com/product-images/mens-shoes/nike-air-jordan-1-red-and-black/thumbnail.webp", true, 149.99m, 4.7699999999999996, null, 143.99m, 1L, "Nike Air Jordan 1 Red And Black" },
                    { 35L, "mens-shoes", new DateTime(2026, 9, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, 18, "https://cdn.dummyjson.com/product-images/mens-shoes/nike-baseball-cleats/thumbnail.webp", true, 79.99m, 3.8799999999999999, null, 65.59m, 1L, "Nike Baseball Cleats" },
                    { 36L, "mens-shoes", new DateTime(2026, 9, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, 4, "https://cdn.dummyjson.com/product-images/mens-shoes/puma-future-rider-trainers/thumbnail.webp", true, 89.99m, 4.9000000000000004, null, 86.39m, 1L, "Puma Future Rider Trainers" },
                    { 37L, "mens-shoes", new DateTime(2026, 9, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, 5, "https://cdn.dummyjson.com/product-images/mens-shoes/sports-sneakers-off-white-&-red/thumbnail.webp", true, 119.99m, 4.7699999999999996, null, 113.99m, 1L, "Sports Sneakers Off White & Red" },
                    { 38L, "mens-shoes", new DateTime(2026, 9, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, null, "https://cdn.dummyjson.com/product-images/mens-shoes/sports-sneakers-off-white-red/thumbnail.webp", true, 109.99m, 4.6900000000000004, null, null, 1L, "Sports Sneakers Off White Red" },
                    { 39L, "mens-watches", new DateTime(2026, 9, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, 6, "https://cdn.dummyjson.com/product-images/mens-watches/brown-leather-belt-watch/thumbnail.webp", true, 89.99m, 4.1900000000000004, null, 84.59m, 1L, "Brown Leather Belt Watch" },
                    { 40L, "mens-watches", new DateTime(2026, 9, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, 17, "https://cdn.dummyjson.com/product-images/mens-watches/longines-master-collection/thumbnail.webp", true, 1499.99m, 3.8700000000000001, null, 1244.99m, 1L, "Longines Master Collection" },
                    { 41L, "mens-watches", new DateTime(2026, 9, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, 9, "https://cdn.dummyjson.com/product-images/mens-watches/rolex-cellini-date-black-dial/thumbnail.webp", true, 8999.99m, 4.9699999999999998, null, 8189.99m, 1L, "Rolex Cellini Date Black Dial" },
                    { 42L, "mens-watches", new DateTime(2026, 9, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, 18, "https://cdn.dummyjson.com/product-images/mens-watches/rolex-cellini-moonphase/thumbnail.webp", true, 12999.99m, 2.5800000000000001, null, 10659.99m, 1L, "Rolex Cellini Moonphase" },
                    { 43L, "mens-watches", new DateTime(2026, 9, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, 4, "https://cdn.dummyjson.com/product-images/mens-watches/rolex-datejust/thumbnail.webp", true, 10999.99m, 3.6600000000000001, null, 10559.99m, 1L, "Rolex Datejust" },
                    { 44L, "mens-watches", new DateTime(2026, 9, 21, 0, 0, 0, 0, DateTimeKind.Utc), null, 5, "https://cdn.dummyjson.com/product-images/mens-watches/rolex-submariner-watch/thumbnail.webp", true, 13999.99m, 2.6899999999999999, null, 13299.99m, 1L, "Rolex Submariner Watch" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 1L);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 2L);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 3L);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 4L);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 5L);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 6L);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 7L);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 8L);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 9L);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 10L);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 11L);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 12L);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 13L);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 14L);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 15L);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 16L);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 17L);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 18L);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 19L);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 20L);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 21L);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 22L);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 23L);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 24L);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 25L);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 26L);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 27L);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 28L);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 29L);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 30L);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 31L);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 32L);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 33L);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 34L);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 35L);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 36L);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 37L);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 38L);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 39L);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 40L);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 41L);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 42L);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 43L);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 44L);

            migrationBuilder.DeleteData(
                table: "Stores",
                keyColumn: "StoreId",
                keyValue: 1L);
        }
    }
}
