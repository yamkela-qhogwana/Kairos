using Kairos.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Kairos.Infrastructure.Persistence;

public class KairosDbContext(DbContextOptions<KairosDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Address> Addresses => Set<Address>();
    public DbSet<AddressType> AddressTypes => Set<AddressType>();
    public DbSet<PasswordHistoryEntry> PasswordHistoryEntries => Set<PasswordHistoryEntry>();
    public DbSet<Store> Stores => Set<Store>();
    public DbSet<Sale> Sales => Set<Sale>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<ProductImage> ProductImages => Set<ProductImage>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(u => u.Email).IsUnique();
        });

        modelBuilder.Entity<Address>(entity =>
        {
            entity.Property(a => a.Location).HasColumnType("geography");

            entity.HasOne(a => a.User)
                .WithMany(u => u.Addresses)
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(a => a.AddressType)
                .WithMany(t => t.Addresses)
                .HasForeignKey(a => a.AddressTypeId)
                .OnDelete(DeleteBehavior.Restrict);

            // A user can't have two addresses claiming the same slot
            // (e.g. two "Primary" addresses).
            entity.HasIndex(a => new { a.UserId, a.AddressTypeId }).IsUnique();
        });

        modelBuilder.Entity<PasswordHistoryEntry>(entity =>
        {
            entity.HasOne(p => p.User)
                .WithMany(u => u.PasswordHistory)
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(p => new { p.UserId, p.CreatedAt });
        });

        modelBuilder.Entity<Store>(entity =>
        {
            entity.Property(s => s.Location).HasColumnType("geography");

            entity.HasOne(s => s.OwnerUser)
                .WithMany()
                .HasForeignKey(s => s.OwnerUserId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Sale>(entity =>
        {
            entity.HasOne(s => s.Store)
                .WithMany(st => st.Sales)
                .HasForeignKey(s => s.StoreId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasIndex(c => c.Slug).IsUnique();
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.Property(p => p.OriginalPrice).HasColumnType("decimal(10,2)");
            entity.Property(p => p.SalePrice).HasColumnType("decimal(10,2)");

            entity.HasOne(p => p.Store)
                .WithMany(s => s.Products)
                .HasForeignKey(p => p.StoreId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(p => p.Sale)
                .WithMany(s => s.Products)
                .HasForeignKey(p => p.SaleId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(p => p.Category)
                .WithMany(c => c.Products)
                .HasForeignKey(p => p.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<ProductImage>(entity =>
        {
            entity.HasOne(pi => pi.Product)
                .WithMany(p => p.Images)
                .HasForeignKey(pi => pi.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(pi => new { pi.ProductId, pi.SortOrder });
        });

        modelBuilder.Entity<AddressType>().HasData(
            new AddressType { AddressTypeId = 1, Name = "Primary" },
            new AddressType { AddressTypeId = 2, Name = "Secondary" },
            new AddressType { AddressTypeId = 3, Name = "Tertiary" }
        );

        // Placeholder catalog data for building the shopping UI before real
        // vendors are onboarded. Names/images are stand-ins only (sourced
        // from a free public product-data API), not real inventory.
        var seedDate = new DateTime(2026, 9, 21, 0, 0, 0, DateTimeKind.Utc);

        modelBuilder.Entity<Store>().HasData(
            new Store { StoreId = 1, Name = "Kairos Demo Store", City = "Johannesburg", IsActive = true, CreatedAt = seedDate }
        );

        modelBuilder.Entity<Category>().HasData(
            new Category { CategoryId = 1, Slug = "womens-dresses", Name = "Dresses", IsActive = true },
            new Category { CategoryId = 2, Slug = "tops", Name = "Tops", IsActive = true },
            new Category { CategoryId = 3, Slug = "womens-shoes", Name = "Women's Shoes", IsActive = true },
            new Category { CategoryId = 4, Slug = "womens-bags", Name = "Bags", IsActive = true },
            new Category { CategoryId = 5, Slug = "womens-jewellery", Name = "Jewellery", IsActive = true },
            new Category { CategoryId = 6, Slug = "sunglasses", Name = "Sunglasses", IsActive = true },
            new Category { CategoryId = 7, Slug = "mens-shirts", Name = "Men's Shirts", IsActive = true },
            new Category { CategoryId = 8, Slug = "mens-shoes", Name = "Men's Shoes", IsActive = true },
            new Category { CategoryId = 9, Slug = "mens-watches", Name = "Watches", IsActive = true }
        );

        modelBuilder.Entity<Product>().HasData(
            new Product { ProductId = 1, StoreId = 1, Title = "Black Women's Gown", CategoryId = 1, OriginalPrice = 129.99m, SalePrice = 116.99m, DiscountPercentage = 10, Rating = 3.64, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 2, StoreId = 1, Title = "Corset Leather With Skirt", CategoryId = 1, OriginalPrice = 89.99m, SalePrice = 75.59m, DiscountPercentage = 16, Rating = 3.05, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 3, StoreId = 1, Title = "Corset With Black Skirt", CategoryId = 1, OriginalPrice = 79.99m, SalePrice = 67.99m, DiscountPercentage = 15, Rating = 4.52, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 4, StoreId = 1, Title = "Dress Pea", CategoryId = 1, OriginalPrice = 49.99m, SalePrice = 40.99m, DiscountPercentage = 18, Rating = 4.88, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 5, StoreId = 1, Title = "Marni Red & Black Suit", CategoryId = 1, OriginalPrice = 179.99m, SalePrice = 145.79m, DiscountPercentage = 19, Rating = 4.48, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 6, StoreId = 1, Title = "Blue Frock", CategoryId = 2, OriginalPrice = 29.99m, SalePrice = 26.39m, DiscountPercentage = 12, Rating = 4.17, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 7, StoreId = 1, Title = "Girl Summer Dress", CategoryId = 2, OriginalPrice = 19.99m, SalePrice = 16.19m, DiscountPercentage = 19, Rating = 4.77, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 8, StoreId = 1, Title = "Gray Dress", CategoryId = 2, OriginalPrice = 34.99m, SalePrice = 30.09m, DiscountPercentage = 14, Rating = 2.72, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 9, StoreId = 1, Title = "Short Frock", CategoryId = 2, OriginalPrice = 24.99m, SalePrice = 21.74m, DiscountPercentage = 13, Rating = 3.23, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 10, StoreId = 1, Title = "Tartan Dress", CategoryId = 2, OriginalPrice = 39.99m, SalePrice = 34.79m, DiscountPercentage = 13, Rating = 4.05, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 11, StoreId = 1, Title = "Black & Brown Slipper", CategoryId = 3, OriginalPrice = 19.99m, SalePrice = 19.39m, DiscountPercentage = 3, Rating = 2.53, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 12, StoreId = 1, Title = "Calvin Klein Heel Shoes", CategoryId = 3, OriginalPrice = 79.99m, SalePrice = 77.59m, DiscountPercentage = 3, Rating = 4.92, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 13, StoreId = 1, Title = "Golden Shoes Woman", CategoryId = 3, OriginalPrice = 49.99m, SalePrice = 42.99m, DiscountPercentage = 14, Rating = 3.26, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 14, StoreId = 1, Title = "Pampi Shoes", CategoryId = 3, OriginalPrice = 29.99m, SalePrice = 25.79m, DiscountPercentage = 14, Rating = 3.05, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 15, StoreId = 1, Title = "Red Shoes", CategoryId = 3, OriginalPrice = 34.99m, SalePrice = 28.69m, DiscountPercentage = 18, Rating = 3.25, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 16, StoreId = 1, Title = "Blue Women's Handbag", CategoryId = 4, OriginalPrice = 49.99m, SalePrice = 40.99m, DiscountPercentage = 18, Rating = 2.92, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 17, StoreId = 1, Title = "Heshe Women's Leather Bag", CategoryId = 4, OriginalPrice = 129.99m, SalePrice = 124.79m, DiscountPercentage = 4, Rating = 4.92, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 18, StoreId = 1, Title = "Prada Women Bag", CategoryId = 4, OriginalPrice = 599.99m, SalePrice = 515.99m, DiscountPercentage = 14, Rating = 2.71, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 19, StoreId = 1, Title = "White Faux Leather Backpack", CategoryId = 4, OriginalPrice = 39.99m, SalePrice = 33.99m, DiscountPercentage = 15, Rating = 3.36, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 20, StoreId = 1, Title = "Women Handbag Black", CategoryId = 4, OriginalPrice = 59.99m, SalePrice = 52.79m, DiscountPercentage = 12, Rating = 2.89, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 21, StoreId = 1, Title = "Green Crystal Earring", CategoryId = 5, OriginalPrice = 29.99m, SalePrice = 25.49m, DiscountPercentage = 15, Rating = 3.96, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 22, StoreId = 1, Title = "Green Oval Earring", CategoryId = 5, OriginalPrice = 24.99m, SalePrice = 21.24m, DiscountPercentage = 15, Rating = 3.57, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 23, StoreId = 1, Title = "Tropical Earring", CategoryId = 5, OriginalPrice = 19.99m, SalePrice = 19.79m, DiscountPercentage = 1, Rating = 4.4, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 24, StoreId = 1, Title = "Black Sun Glasses", CategoryId = 6, OriginalPrice = 29.99m, SalePrice = 28.49m, DiscountPercentage = 5, Rating = 4.41, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 25, StoreId = 1, Title = "Classic Sun Glasses", CategoryId = 6, OriginalPrice = 24.99m, SalePrice = 23.74m, DiscountPercentage = 5, Rating = 3.86, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 26, StoreId = 1, Title = "Green and Black Glasses", CategoryId = 6, OriginalPrice = 34.99m, SalePrice = 34.64m, DiscountPercentage = 1, Rating = 4.55, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 27, StoreId = 1, Title = "Party Glasses", CategoryId = 6, OriginalPrice = 19.99m, SalePrice = 17.79m, DiscountPercentage = 11, Rating = 2.79, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 28, StoreId = 1, Title = "Sunglasses", CategoryId = 6, OriginalPrice = 22.99m, SalePrice = 22.53m, DiscountPercentage = 2, Rating = 3.02, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 29, StoreId = 1, Title = "Blue & Black Check Shirt", CategoryId = 7, OriginalPrice = 29.99m, SalePrice = 25.49m, DiscountPercentage = 15, Rating = 3.64, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 30, StoreId = 1, Title = "Gigabyte Aorus Men Tshirt", CategoryId = 7, OriginalPrice = 24.99m, SalePrice = 24.74m, DiscountPercentage = 1, Rating = 3.18, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 31, StoreId = 1, Title = "Man Plaid Shirt", CategoryId = 7, OriginalPrice = 34.99m, SalePrice = 27.99m, DiscountPercentage = 20, Rating = 3.46, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 32, StoreId = 1, Title = "Man Short Sleeve Shirt", CategoryId = 7, OriginalPrice = 19.99m, SalePrice = 18.59m, DiscountPercentage = 7, Rating = 2.9, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 33, StoreId = 1, Title = "Men Check Shirt", CategoryId = 7, OriginalPrice = 27.99m, SalePrice = 24.91m, DiscountPercentage = 11, Rating = 2.72, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 34, StoreId = 1, Title = "Nike Air Jordan 1 Red And Black", CategoryId = 8, OriginalPrice = 149.99m, SalePrice = 143.99m, DiscountPercentage = 4, Rating = 4.77, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 35, StoreId = 1, Title = "Nike Baseball Cleats", CategoryId = 8, OriginalPrice = 79.99m, SalePrice = 65.59m, DiscountPercentage = 18, Rating = 3.88, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 36, StoreId = 1, Title = "Puma Future Rider Trainers", CategoryId = 8, OriginalPrice = 89.99m, SalePrice = 86.39m, DiscountPercentage = 4, Rating = 4.9, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 37, StoreId = 1, Title = "Sports Sneakers Off White & Red", CategoryId = 8, OriginalPrice = 119.99m, SalePrice = 113.99m, DiscountPercentage = 5, Rating = 4.77, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 38, StoreId = 1, Title = "Sports Sneakers Off White Red", CategoryId = 8, OriginalPrice = 109.99m, SalePrice = null, DiscountPercentage = null, Rating = 4.69, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 39, StoreId = 1, Title = "Brown Leather Belt Watch", CategoryId = 9, OriginalPrice = 89.99m, SalePrice = 84.59m, DiscountPercentage = 6, Rating = 4.19, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 40, StoreId = 1, Title = "Longines Master Collection", CategoryId = 9, OriginalPrice = 1499.99m, SalePrice = 1244.99m, DiscountPercentage = 17, Rating = 3.87, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 41, StoreId = 1, Title = "Rolex Cellini Date Black Dial", CategoryId = 9, OriginalPrice = 8999.99m, SalePrice = 8189.99m, DiscountPercentage = 9, Rating = 4.97, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 42, StoreId = 1, Title = "Rolex Cellini Moonphase", CategoryId = 9, OriginalPrice = 12999.99m, SalePrice = 10659.99m, DiscountPercentage = 18, Rating = 2.58, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 43, StoreId = 1, Title = "Rolex Datejust", CategoryId = 9, OriginalPrice = 10999.99m, SalePrice = 10559.99m, DiscountPercentage = 4, Rating = 3.66, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 44, StoreId = 1, Title = "Rolex Submariner Watch", CategoryId = 9, OriginalPrice = 13999.99m, SalePrice = 13299.99m, DiscountPercentage = 5, Rating = 2.69, IsActive = true, CreatedAt = seedDate }
        );

        modelBuilder.Entity<ProductImage>().HasData(
            new ProductImage { ProductImageId = 1, ProductId = 1, SortOrder = 0, ImageUrl = "https://cdn.dummyjson.com/product-images/womens-dresses/black-women's-gown/thumbnail.webp" },
            new ProductImage { ProductImageId = 2, ProductId = 1, SortOrder = 1, ImageUrl = "https://cdn.dummyjson.com/product-images/womens-dresses/black-women's-gown/1.webp" },
            new ProductImage { ProductImageId = 3, ProductId = 2, SortOrder = 0, ImageUrl = "https://cdn.dummyjson.com/product-images/womens-dresses/corset-leather-with-skirt/thumbnail.webp" },
            new ProductImage { ProductImageId = 4, ProductId = 3, SortOrder = 0, ImageUrl = "https://cdn.dummyjson.com/product-images/womens-dresses/corset-with-black-skirt/thumbnail.webp" },
            new ProductImage { ProductImageId = 5, ProductId = 4, SortOrder = 0, ImageUrl = "https://cdn.dummyjson.com/product-images/womens-dresses/dress-pea/thumbnail.webp" },
            new ProductImage { ProductImageId = 6, ProductId = 5, SortOrder = 0, ImageUrl = "https://cdn.dummyjson.com/product-images/womens-dresses/marni-red-&-black-suit/thumbnail.webp" },
            new ProductImage { ProductImageId = 7, ProductId = 6, SortOrder = 0, ImageUrl = "https://cdn.dummyjson.com/product-images/tops/blue-frock/thumbnail.webp" },
            new ProductImage { ProductImageId = 8, ProductId = 7, SortOrder = 0, ImageUrl = "https://cdn.dummyjson.com/product-images/tops/girl-summer-dress/thumbnail.webp" },
            new ProductImage { ProductImageId = 9, ProductId = 8, SortOrder = 0, ImageUrl = "https://cdn.dummyjson.com/product-images/tops/gray-dress/thumbnail.webp" },
            new ProductImage { ProductImageId = 10, ProductId = 9, SortOrder = 0, ImageUrl = "https://cdn.dummyjson.com/product-images/tops/short-frock/thumbnail.webp" },
            new ProductImage { ProductImageId = 11, ProductId = 10, SortOrder = 0, ImageUrl = "https://cdn.dummyjson.com/product-images/tops/tartan-dress/thumbnail.webp" },
            new ProductImage { ProductImageId = 12, ProductId = 11, SortOrder = 0, ImageUrl = "https://cdn.dummyjson.com/product-images/womens-shoes/black-&-brown-slipper/thumbnail.webp" },
            new ProductImage { ProductImageId = 13, ProductId = 12, SortOrder = 0, ImageUrl = "https://cdn.dummyjson.com/product-images/womens-shoes/calvin-klein-heel-shoes/thumbnail.webp" },
            new ProductImage { ProductImageId = 14, ProductId = 13, SortOrder = 0, ImageUrl = "https://cdn.dummyjson.com/product-images/womens-shoes/golden-shoes-woman/thumbnail.webp" },
            new ProductImage { ProductImageId = 15, ProductId = 14, SortOrder = 0, ImageUrl = "https://cdn.dummyjson.com/product-images/womens-shoes/pampi-shoes/thumbnail.webp" },
            new ProductImage { ProductImageId = 16, ProductId = 15, SortOrder = 0, ImageUrl = "https://cdn.dummyjson.com/product-images/womens-shoes/red-shoes/thumbnail.webp" },
            new ProductImage { ProductImageId = 17, ProductId = 16, SortOrder = 0, ImageUrl = "https://cdn.dummyjson.com/product-images/womens-bags/blue-women's-handbag/thumbnail.webp" },
            new ProductImage { ProductImageId = 18, ProductId = 17, SortOrder = 0, ImageUrl = "https://cdn.dummyjson.com/product-images/womens-bags/heshe-women's-leather-bag/thumbnail.webp" },
            new ProductImage { ProductImageId = 19, ProductId = 18, SortOrder = 0, ImageUrl = "https://cdn.dummyjson.com/product-images/womens-bags/prada-women-bag/thumbnail.webp" },
            new ProductImage { ProductImageId = 20, ProductId = 18, SortOrder = 1, ImageUrl = "https://cdn.dummyjson.com/product-images/womens-bags/prada-women-bag/1.webp" },
            new ProductImage { ProductImageId = 21, ProductId = 19, SortOrder = 0, ImageUrl = "https://cdn.dummyjson.com/product-images/womens-bags/white-faux-leather-backpack/thumbnail.webp" },
            new ProductImage { ProductImageId = 22, ProductId = 20, SortOrder = 0, ImageUrl = "https://cdn.dummyjson.com/product-images/womens-bags/women-handbag-black/thumbnail.webp" },
            new ProductImage { ProductImageId = 23, ProductId = 21, SortOrder = 0, ImageUrl = "https://cdn.dummyjson.com/product-images/womens-jewellery/green-crystal-earring/thumbnail.webp" },
            new ProductImage { ProductImageId = 24, ProductId = 22, SortOrder = 0, ImageUrl = "https://cdn.dummyjson.com/product-images/womens-jewellery/green-oval-earring/thumbnail.webp" },
            new ProductImage { ProductImageId = 25, ProductId = 23, SortOrder = 0, ImageUrl = "https://cdn.dummyjson.com/product-images/womens-jewellery/tropical-earring/thumbnail.webp" },
            new ProductImage { ProductImageId = 26, ProductId = 24, SortOrder = 0, ImageUrl = "https://cdn.dummyjson.com/product-images/sunglasses/black-sun-glasses/thumbnail.webp" },
            new ProductImage { ProductImageId = 27, ProductId = 24, SortOrder = 1, ImageUrl = "https://cdn.dummyjson.com/product-images/sunglasses/black-sun-glasses/1.webp" },
            new ProductImage { ProductImageId = 28, ProductId = 25, SortOrder = 0, ImageUrl = "https://cdn.dummyjson.com/product-images/sunglasses/classic-sun-glasses/thumbnail.webp" },
            new ProductImage { ProductImageId = 29, ProductId = 26, SortOrder = 0, ImageUrl = "https://cdn.dummyjson.com/product-images/sunglasses/green-and-black-glasses/thumbnail.webp" },
            new ProductImage { ProductImageId = 30, ProductId = 27, SortOrder = 0, ImageUrl = "https://cdn.dummyjson.com/product-images/sunglasses/party-glasses/thumbnail.webp" },
            new ProductImage { ProductImageId = 31, ProductId = 28, SortOrder = 0, ImageUrl = "https://cdn.dummyjson.com/product-images/sunglasses/sunglasses/thumbnail.webp" },
            new ProductImage { ProductImageId = 32, ProductId = 29, SortOrder = 0, ImageUrl = "https://cdn.dummyjson.com/product-images/mens-shirts/blue-&-black-check-shirt/thumbnail.webp" },
            new ProductImage { ProductImageId = 33, ProductId = 30, SortOrder = 0, ImageUrl = "https://cdn.dummyjson.com/product-images/mens-shirts/gigabyte-aorus-men-tshirt/thumbnail.webp" },
            new ProductImage { ProductImageId = 34, ProductId = 31, SortOrder = 0, ImageUrl = "https://cdn.dummyjson.com/product-images/mens-shirts/man-plaid-shirt/thumbnail.webp" },
            new ProductImage { ProductImageId = 35, ProductId = 32, SortOrder = 0, ImageUrl = "https://cdn.dummyjson.com/product-images/mens-shirts/man-short-sleeve-shirt/thumbnail.webp" },
            new ProductImage { ProductImageId = 36, ProductId = 33, SortOrder = 0, ImageUrl = "https://cdn.dummyjson.com/product-images/mens-shirts/men-check-shirt/thumbnail.webp" },
            new ProductImage { ProductImageId = 37, ProductId = 34, SortOrder = 0, ImageUrl = "https://cdn.dummyjson.com/product-images/mens-shoes/nike-air-jordan-1-red-and-black/thumbnail.webp" },
            new ProductImage { ProductImageId = 38, ProductId = 34, SortOrder = 1, ImageUrl = "https://cdn.dummyjson.com/product-images/mens-shoes/nike-air-jordan-1-red-and-black/1.webp" },
            new ProductImage { ProductImageId = 39, ProductId = 35, SortOrder = 0, ImageUrl = "https://cdn.dummyjson.com/product-images/mens-shoes/nike-baseball-cleats/thumbnail.webp" },
            new ProductImage { ProductImageId = 40, ProductId = 36, SortOrder = 0, ImageUrl = "https://cdn.dummyjson.com/product-images/mens-shoes/puma-future-rider-trainers/thumbnail.webp" },
            new ProductImage { ProductImageId = 41, ProductId = 37, SortOrder = 0, ImageUrl = "https://cdn.dummyjson.com/product-images/mens-shoes/sports-sneakers-off-white-&-red/thumbnail.webp" },
            new ProductImage { ProductImageId = 42, ProductId = 38, SortOrder = 0, ImageUrl = "https://cdn.dummyjson.com/product-images/mens-shoes/sports-sneakers-off-white-red/thumbnail.webp" },
            new ProductImage { ProductImageId = 43, ProductId = 39, SortOrder = 0, ImageUrl = "https://cdn.dummyjson.com/product-images/mens-watches/brown-leather-belt-watch/thumbnail.webp" },
            new ProductImage { ProductImageId = 44, ProductId = 40, SortOrder = 0, ImageUrl = "https://cdn.dummyjson.com/product-images/mens-watches/longines-master-collection/thumbnail.webp" },
            new ProductImage { ProductImageId = 45, ProductId = 41, SortOrder = 0, ImageUrl = "https://cdn.dummyjson.com/product-images/mens-watches/rolex-cellini-date-black-dial/thumbnail.webp" },
            new ProductImage { ProductImageId = 46, ProductId = 41, SortOrder = 1, ImageUrl = "https://cdn.dummyjson.com/product-images/mens-watches/rolex-cellini-date-black-dial/1.webp" },
            new ProductImage { ProductImageId = 47, ProductId = 42, SortOrder = 0, ImageUrl = "https://cdn.dummyjson.com/product-images/mens-watches/rolex-cellini-moonphase/thumbnail.webp" },
            new ProductImage { ProductImageId = 48, ProductId = 43, SortOrder = 0, ImageUrl = "https://cdn.dummyjson.com/product-images/mens-watches/rolex-datejust/thumbnail.webp" },
            new ProductImage { ProductImageId = 49, ProductId = 44, SortOrder = 0, ImageUrl = "https://cdn.dummyjson.com/product-images/mens-watches/rolex-submariner-watch/thumbnail.webp" }
        );
    }
}
