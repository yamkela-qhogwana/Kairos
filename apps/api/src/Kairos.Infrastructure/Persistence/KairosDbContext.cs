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
    public DbSet<Collection> Collections => Set<Collection>();
    public DbSet<Subcategory> Subcategories => Set<Subcategory>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<ProductSize> ProductSizes => Set<ProductSize>();
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

        modelBuilder.Entity<Collection>(entity =>
        {
            entity.HasIndex(c => c.Slug).IsUnique();
        });

        modelBuilder.Entity<Subcategory>(entity =>
        {
            entity.HasIndex(s => s.Slug).IsUnique();

            entity.HasOne(s => s.Category)
                .WithMany()
                .HasForeignKey(s => s.CategoryId)
                .OnDelete(DeleteBehavior.Cascade);
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

            entity.HasOne(p => p.Subcategory)
                .WithMany(s => s.Products)
                .HasForeignKey(p => p.SubcategoryId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<ProductImage>(entity =>
        {
            entity.HasOne(pi => pi.Product)
                .WithMany(p => p.Images)
                .HasForeignKey(pi => pi.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(pi => new { pi.ProductId, pi.SortOrder });
        });

        modelBuilder.Entity<ProductSize>(entity =>
        {
            entity.HasOne(ps => ps.Product)
                .WithMany(p => p.Sizes)
                .HasForeignKey(ps => ps.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(ps => new { ps.ProductId, ps.Size }).IsUnique();
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
            new Category { CategoryId = 1, Slug = "mens", Name = "Men's", IsActive = true },
            new Category { CategoryId = 2, Slug = "womens", Name = "Women's", IsActive = true },
            new Category { CategoryId = 3, Slug = "beauty", Name = "Beauty", IsActive = true },
            new Category { CategoryId = 4, Slug = "home", Name = "Home", IsActive = true },
            new Category { CategoryId = 5, Slug = "kids", Name = "Kids", IsActive = true },
            new Category { CategoryId = 6, Slug = "office", Name = "Office", IsActive = true },
            new Category { CategoryId = 7, Slug = "electronics", Name = "Electronics", IsActive = true },
            new Category { CategoryId = 8, Slug = "curve", Name = "Curve", IsActive = true },
            new Category { CategoryId = 9, Slug = "jewelry", Name = "Jewelry", IsActive = true },
            new Category { CategoryId = 10, Slug = "sports", Name = "Sports", IsActive = true },
            new Category { CategoryId = 11, Slug = "bags", Name = "Bags", IsActive = true },
            new Category { CategoryId = 12, Slug = "toys", Name = "Toys", IsActive = true },
            new Category { CategoryId = 13, Slug = "seasonal", Name = "Seasonal", IsActive = true }
        );

        modelBuilder.Entity<Subcategory>().HasData(
            new Subcategory { SubcategoryId = 1, CategoryId = 2, Slug = "dresses", Name = "Dresses", SortOrder = 1, IsActive = true },
            new Subcategory { SubcategoryId = 2, CategoryId = 2, Slug = "suits-corsets", Name = "Suits & Corsets", SortOrder = 2, IsActive = true },
            new Subcategory { SubcategoryId = 3, CategoryId = 2, Slug = "shoes", Name = "Shoes", SortOrder = 3, IsActive = true },
            new Subcategory { SubcategoryId = 4, CategoryId = 2, Slug = "eyewear", Name = "Eyewear", SortOrder = 4, IsActive = true },
            new Subcategory { SubcategoryId = 5, CategoryId = 1, Slug = "shirts-tees", Name = "Shirts & Tees", SortOrder = 1, IsActive = true },
            new Subcategory { SubcategoryId = 6, CategoryId = 1, Slug = "footwear", Name = "Footwear", SortOrder = 2, IsActive = true },
            new Subcategory { SubcategoryId = 7, CategoryId = 1, Slug = "watches", Name = "Watches", SortOrder = 3, IsActive = true },
            new Subcategory { SubcategoryId = 8, CategoryId = 11, Slug = "handbags", Name = "Handbags", SortOrder = 1, IsActive = true },
            new Subcategory { SubcategoryId = 9, CategoryId = 11, Slug = "backpacks", Name = "Backpacks", SortOrder = 2, IsActive = true },
            new Subcategory { SubcategoryId = 10, CategoryId = 9, Slug = "earrings", Name = "Earrings", SortOrder = 1, IsActive = true }
        );

        modelBuilder.Entity<Collection>().HasData(
            new Collection { CollectionId = 1, Slug = "bestsellers", Name = "Bestsellers", Icon = "star-outline", SortOrder = 1, IsActive = true },
            new Collection { CollectionId = 2, Slug = "luxe", Name = "Luxe", Icon = "diamond-stone", SortOrder = 2, IsActive = true },
            new Collection { CollectionId = 3, Slug = "clearance", Name = "Clearance", Icon = "tag-outline", SortOrder = 3, IsActive = true },
            new Collection { CollectionId = 4, Slug = "seasonal", Name = "Seasonal", Icon = "gift-outline", SortOrder = 4, IsActive = true },
            new Collection { CollectionId = 5, Slug = "rent", Name = "Rent", Icon = "calendar-clock-outline", SortOrder = 5, IsActive = true }
        );

        // Two demo sale campaigns so products on sale can show a real
        // countdown. Fixed future dates (not DateTime.UtcNow) because
        // HasData values are baked into the migration at generation time.
        modelBuilder.Entity<Sale>().HasData(
            new Sale { SaleId = 1, StoreId = 1, Name = "Flash Sale", StartDate = seedDate, EndDate = new DateTime(2026, 10, 17, 20, 0, 0, DateTimeKind.Utc), IsActive = true },
            new Sale { SaleId = 2, StoreId = 1, Name = "Weekend Deals", StartDate = seedDate, EndDate = new DateTime(2026, 10, 20, 20, 0, 0, DateTimeKind.Utc), IsActive = true }
        );

        modelBuilder.Entity<Product>().HasData(
            new Product { ProductId = 1, StoreId = 1, SaleId = 1, Title = "Black Women's Gown", Description = "An elegant floor-length gown in black, finished with a tailored silhouette for evening occasions.", CategoryId = 2, SubcategoryId = 1, OriginalPrice = 129.99m, SalePrice = 116.99m, DiscountPercentage = 10, Rating = 3.64, IsRentable = true, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 2, StoreId = 1, SaleId = 1, Title = "Corset Leather With Skirt", Description = "A structured leather corset paired with a matching skirt for a bold, fitted look.", CategoryId = 2, SubcategoryId = 2, OriginalPrice = 89.99m, SalePrice = 75.59m, DiscountPercentage = 16, Rating = 3.05, IsRentable = true, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 3, StoreId = 1, SaleId = 1, Title = "Corset With Black Skirt", Description = "A classic black corset top with a coordinating skirt, cinched at the waist.", CategoryId = 2, SubcategoryId = 2, OriginalPrice = 79.99m, SalePrice = 67.99m, DiscountPercentage = 15, Rating = 4.52, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 4, StoreId = 1, SaleId = 1, Title = "Dress Pea", Description = "A soft pea-green dress with a relaxed fit, perfect for everyday wear.", CategoryId = 2, SubcategoryId = 1, OriginalPrice = 49.99m, SalePrice = 40.99m, DiscountPercentage = 18, Rating = 4.88, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 5, StoreId = 1, SaleId = 1, Title = "Marni Red & Black Suit", Description = "A striking red and black two-piece suit with sharp tailoring.", CategoryId = 2, SubcategoryId = 2, OriginalPrice = 179.99m, SalePrice = 145.79m, DiscountPercentage = 19, Rating = 4.48, IsRentable = true, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 6, StoreId = 1, SaleId = 1, Title = "Blue Frock", Description = "A lightweight blue frock with a flattering A-line cut.", CategoryId = 2, SubcategoryId = 1, OriginalPrice = 29.99m, SalePrice = 26.39m, DiscountPercentage = 12, Rating = 4.17, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 7, StoreId = 1, SaleId = 1, Title = "Girl Summer Dress", Description = "A breezy summer dress in a light fabric, ideal for warm days.", CategoryId = 2, SubcategoryId = 1, OriginalPrice = 19.99m, SalePrice = 16.19m, DiscountPercentage = 19, Rating = 4.77, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 8, StoreId = 1, SaleId = 1, Title = "Gray Dress", Description = "A versatile grey dress that moves easily from day to evening.", CategoryId = 2, SubcategoryId = 1, OriginalPrice = 34.99m, SalePrice = 30.09m, DiscountPercentage = 14, Rating = 2.72, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 9, StoreId = 1, SaleId = 1, Title = "Short Frock", Description = "A playful short frock with a fitted bodice and flared hem.", CategoryId = 2, SubcategoryId = 1, OriginalPrice = 24.99m, SalePrice = 21.74m, DiscountPercentage = 13, Rating = 3.23, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 10, StoreId = 1, SaleId = 1, Title = "Tartan Dress", Description = "A tartan-print dress with a nipped waist and classic collar.", CategoryId = 2, SubcategoryId = 1, OriginalPrice = 39.99m, SalePrice = 34.79m, DiscountPercentage = 13, Rating = 4.05, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 11, StoreId = 1, SaleId = 1, Title = "Black & Brown Slipper", Description = "Soft slip-on slippers in a black and brown colourway.", CategoryId = 2, SubcategoryId = 3, OriginalPrice = 19.99m, SalePrice = 19.39m, DiscountPercentage = 3, Rating = 2.53, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 12, StoreId = 1, SaleId = 1, Title = "Calvin Klein Heel Shoes", Description = "Pointed-toe heels from Calvin Klein with a sleek finish.", CategoryId = 2, SubcategoryId = 3, OriginalPrice = 79.99m, SalePrice = 77.59m, DiscountPercentage = 3, Rating = 4.92, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 13, StoreId = 1, SaleId = 1, Title = "Golden Shoes Woman", Description = "Metallic gold heels designed to catch the light at any event.", CategoryId = 2, SubcategoryId = 3, OriginalPrice = 49.99m, SalePrice = 42.99m, DiscountPercentage = 14, Rating = 3.26, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 14, StoreId = 1, SaleId = 1, Title = "Pampi Shoes", Description = "Comfortable everyday flats with a cushioned footbed.", CategoryId = 2, SubcategoryId = 3, OriginalPrice = 29.99m, SalePrice = 25.79m, DiscountPercentage = 14, Rating = 3.05, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 15, StoreId = 1, SaleId = 1, Title = "Red Shoes", Description = "Statement red shoes with a rounded toe and block heel.", CategoryId = 2, SubcategoryId = 3, OriginalPrice = 34.99m, SalePrice = 28.69m, DiscountPercentage = 18, Rating = 3.25, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 16, StoreId = 1, SaleId = 1, Title = "Blue Women's Handbag", Description = "A structured blue handbag with a top handle and adjustable strap.", CategoryId = 11, SubcategoryId = 8, OriginalPrice = 49.99m, SalePrice = 40.99m, DiscountPercentage = 18, Rating = 2.92, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 17, StoreId = 1, SaleId = 1, Title = "Heshe Women's Leather Bag", Description = "A genuine leather handbag from Heshe with a timeless silhouette.", CategoryId = 11, SubcategoryId = 8, OriginalPrice = 129.99m, SalePrice = 124.79m, DiscountPercentage = 4, Rating = 4.92, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 18, StoreId = 1, SaleId = 1, Title = "Prada Women Bag", Description = "A premium Prada handbag crafted for everyday luxury.", CategoryId = 11, SubcategoryId = 8, OriginalPrice = 599.99m, SalePrice = 515.99m, DiscountPercentage = 14, Rating = 2.71, IsRentable = true, IsLuxe = true, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 19, StoreId = 1, SaleId = 1, Title = "White Faux Leather Backpack", Description = "A white faux-leather backpack with padded straps for daily use.", CategoryId = 11, SubcategoryId = 9, OriginalPrice = 39.99m, SalePrice = 33.99m, DiscountPercentage = 15, Rating = 3.36, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 20, StoreId = 1, SaleId = 1, Title = "Women Handbag Black", Description = "A classic black handbag with a roomy interior and secure zip closure.", CategoryId = 11, SubcategoryId = 8, OriginalPrice = 59.99m, SalePrice = 52.79m, DiscountPercentage = 12, Rating = 2.89, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 21, StoreId = 1, SaleId = 1, Title = "Green Crystal Earring", Description = "Crystal drop earrings in a rich emerald green.", CategoryId = 9, SubcategoryId = 10, OriginalPrice = 29.99m, SalePrice = 25.49m, DiscountPercentage = 15, Rating = 3.96, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 22, StoreId = 1, SaleId = 1, Title = "Green Oval Earring", Description = "Oval-cut green stone earrings with a delicate gold-tone setting.", CategoryId = 9, SubcategoryId = 10, OriginalPrice = 24.99m, SalePrice = 21.24m, DiscountPercentage = 15, Rating = 3.57, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 23, StoreId = 1, SaleId = 2, Title = "Tropical Earring", Description = "Statement earrings with a tropical-inspired design.", CategoryId = 9, SubcategoryId = 10, OriginalPrice = 19.99m, SalePrice = 19.79m, DiscountPercentage = 1, Rating = 4.4, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 24, StoreId = 1, SaleId = 2, Title = "Black Sun Glasses", Description = "Classic black sunglasses with UV-protective lenses.", CategoryId = 2, SubcategoryId = 4, OriginalPrice = 29.99m, SalePrice = 28.49m, DiscountPercentage = 5, Rating = 4.41, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 25, StoreId = 1, SaleId = 2, Title = "Classic Sun Glasses", Description = "Timeless sunglasses with a rounded frame.", CategoryId = 2, SubcategoryId = 4, OriginalPrice = 24.99m, SalePrice = 23.74m, DiscountPercentage = 5, Rating = 3.86, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 26, StoreId = 1, SaleId = 2, Title = "Green and Black Glasses", Description = "Two-tone sunglasses in green and black with a modern frame.", CategoryId = 2, SubcategoryId = 4, OriginalPrice = 34.99m, SalePrice = 34.64m, DiscountPercentage = 1, Rating = 4.55, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 27, StoreId = 1, SaleId = 2, Title = "Party Glasses", Description = "Statement sunglasses with a bold frame, made for standing out.", CategoryId = 2, SubcategoryId = 4, OriginalPrice = 19.99m, SalePrice = 17.79m, DiscountPercentage = 11, Rating = 2.79, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 28, StoreId = 1, SaleId = 2, Title = "Sunglasses", Description = "Everyday sunglasses with a lightweight frame.", CategoryId = 2, SubcategoryId = 4, OriginalPrice = 22.99m, SalePrice = 22.53m, DiscountPercentage = 2, Rating = 3.02, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 29, StoreId = 1, SaleId = 2, Title = "Blue & Black Check Shirt", Description = "A checked shirt in blue and black, cut for a relaxed everyday fit.", CategoryId = 1, SubcategoryId = 5, OriginalPrice = 29.99m, SalePrice = 25.49m, DiscountPercentage = 15, Rating = 3.64, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 30, StoreId = 1, SaleId = 2, Title = "Gigabyte Aorus Men Tshirt", Description = "A graphic Aorus-branded t-shirt in soft cotton.", CategoryId = 1, SubcategoryId = 5, OriginalPrice = 24.99m, SalePrice = 24.74m, DiscountPercentage = 1, Rating = 3.18, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 31, StoreId = 1, SaleId = 2, Title = "Man Plaid Shirt", Description = "A classic plaid shirt with a button-down collar.", CategoryId = 1, SubcategoryId = 5, OriginalPrice = 34.99m, SalePrice = 27.99m, DiscountPercentage = 20, Rating = 3.46, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 32, StoreId = 1, SaleId = 2, Title = "Man Short Sleeve Shirt", Description = "A lightweight short-sleeve shirt for warm-weather wear.", CategoryId = 1, SubcategoryId = 5, OriginalPrice = 19.99m, SalePrice = 18.59m, DiscountPercentage = 7, Rating = 2.9, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 33, StoreId = 1, SaleId = 2, Title = "Men Check Shirt", Description = "A checked button-up shirt with a tailored fit.", CategoryId = 1, SubcategoryId = 5, OriginalPrice = 27.99m, SalePrice = 24.91m, DiscountPercentage = 11, Rating = 2.72, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 34, StoreId = 1, SaleId = 2, Title = "Nike Air Jordan 1 Red And Black", Description = "Iconic Air Jordan 1 sneakers in a red and black colourway.", CategoryId = 1, SubcategoryId = 6, OriginalPrice = 149.99m, SalePrice = 143.99m, DiscountPercentage = 4, Rating = 4.77, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 35, StoreId = 1, SaleId = 2, Title = "Nike Baseball Cleats", Description = "Performance baseball cleats built for grip and speed.", CategoryId = 1, SubcategoryId = 6, OriginalPrice = 79.99m, SalePrice = 65.59m, DiscountPercentage = 18, Rating = 3.88, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 36, StoreId = 1, SaleId = 2, Title = "Puma Future Rider Trainers", Description = "Retro-styled Puma trainers with a cushioned sole.", CategoryId = 1, SubcategoryId = 6, OriginalPrice = 89.99m, SalePrice = 86.39m, DiscountPercentage = 4, Rating = 4.9, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 37, StoreId = 1, SaleId = 2, Title = "Sports Sneakers Off White & Red", Description = "Lightweight sneakers in off-white and red, built for everyday training.", CategoryId = 1, SubcategoryId = 6, OriginalPrice = 119.99m, SalePrice = 113.99m, DiscountPercentage = 5, Rating = 4.77, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 38, StoreId = 1, Title = "Sports Sneakers Off White Red", Description = "A low-top sneaker in off-white with red accents.", CategoryId = 1, SubcategoryId = 6, OriginalPrice = 109.99m, SalePrice = null, DiscountPercentage = null, Rating = 4.69, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 39, StoreId = 1, SaleId = 2, Title = "Brown Leather Belt Watch", Description = "A classic watch with a brown leather strap and minimalist dial.", CategoryId = 1, SubcategoryId = 7, OriginalPrice = 89.99m, SalePrice = 84.59m, DiscountPercentage = 6, Rating = 4.19, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 40, StoreId = 1, SaleId = 2, Title = "Longines Master Collection", Description = "A Longines Master Collection watch with a refined, understated face.", CategoryId = 1, SubcategoryId = 7, OriginalPrice = 1499.99m, SalePrice = 1244.99m, DiscountPercentage = 17, Rating = 3.87, IsRentable = true, IsLuxe = true, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 41, StoreId = 1, SaleId = 2, Title = "Rolex Cellini Date Black Dial", Description = "A Rolex Cellini with a black dial and date function.", CategoryId = 1, SubcategoryId = 7, OriginalPrice = 8999.99m, SalePrice = 8189.99m, DiscountPercentage = 9, Rating = 4.97, IsLuxe = true, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 42, StoreId = 1, SaleId = 2, Title = "Rolex Cellini Moonphase", Description = "A Rolex Cellini Moonphase with an intricate dial complication.", CategoryId = 1, SubcategoryId = 7, OriginalPrice = 12999.99m, SalePrice = 10659.99m, DiscountPercentage = 18, Rating = 2.58, IsLuxe = true, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 43, StoreId = 1, SaleId = 2, Title = "Rolex Datejust", Description = "A Rolex Datejust, the brand's most recognisable classic.", CategoryId = 1, SubcategoryId = 7, OriginalPrice = 10999.99m, SalePrice = 10559.99m, DiscountPercentage = 4, Rating = 3.66, IsLuxe = true, IsActive = true, CreatedAt = seedDate },
            new Product { ProductId = 44, StoreId = 1, SaleId = 2, Title = "Rolex Submariner Watch", Description = "A Rolex Submariner built for durability and timeless style.", CategoryId = 1, SubcategoryId = 7, OriginalPrice = 13999.99m, SalePrice = 13299.99m, DiscountPercentage = 5, Rating = 2.69, IsLuxe = true, IsActive = true, CreatedAt = seedDate }
        );

        // Per-size stock, generated from a fixed table rather than typed out
        // by hand — same placeholder-data spirit as the rest of this seed.
        // Quantity is a flat default (no real inventory data exists yet) and
        // decreases via IProductStockService when a size is purchased.
        var clothingSizeList = new[] { "XS", "S", "M", "L", "XL" };
        var womensShoeSizeList = new[] { "6", "7", "8", "9", "10", "11" };
        var mensShoeSizeList = new[] { "6", "7", "8", "9", "10", "11", "12" };
        var oneSizeList = new[] { "One Size" };

        var productSizeGroups = new (long ProductId, string[] Sizes)[]
        {
            (1, clothingSizeList), (2, clothingSizeList), (3, clothingSizeList), (4, clothingSizeList),
            (5, clothingSizeList), (6, clothingSizeList), (7, clothingSizeList), (8, clothingSizeList),
            (9, clothingSizeList), (10, clothingSizeList),
            (11, womensShoeSizeList), (12, womensShoeSizeList), (13, womensShoeSizeList),
            (14, womensShoeSizeList), (15, womensShoeSizeList),
            (16, oneSizeList), (17, oneSizeList), (18, oneSizeList), (19, oneSizeList), (20, oneSizeList),
            (21, oneSizeList), (22, oneSizeList), (23, oneSizeList),
            (24, oneSizeList), (25, oneSizeList), (26, oneSizeList), (27, oneSizeList), (28, oneSizeList),
            (29, clothingSizeList), (30, clothingSizeList), (31, clothingSizeList),
            (32, clothingSizeList), (33, clothingSizeList),
            (34, mensShoeSizeList), (35, mensShoeSizeList), (36, mensShoeSizeList),
            (37, mensShoeSizeList), (38, mensShoeSizeList),
            (39, oneSizeList), (40, oneSizeList), (41, oneSizeList),
            (42, oneSizeList), (43, oneSizeList), (44, oneSizeList),
        };

        const int defaultStockPerSize = 20;
        var nextProductSizeId = 0L;
        var productSizes = productSizeGroups
            .SelectMany(g => g.Sizes.Select(size => new ProductSize
            {
                ProductSizeId = ++nextProductSizeId,
                ProductId = g.ProductId,
                Size = size,
                Quantity = defaultStockPerSize,
            }))
            .ToArray();

        modelBuilder.Entity<ProductSize>().HasData(productSizes);

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
