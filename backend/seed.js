const mongoose = require("mongoose");
const Product = require("./models/Product");
const User = require("./models/User");
require("dotenv").config();

const sampleProducts = [
  {
    name: "Kesar Chandan (30ml)",
    description:
      "Warm saffron and creamy sandalwood - Kesar Chandan in a 30ml bottle.",
    price: 349,
    category: "Women's Perfume",
    image: "/Products/Kesar%20Chandan.jpg",
    stock: 80,
    rating: 4.7,
    numReviews: 64,
  },
  {
    name: "Rose (30ml)",
    description:
      "A classic rosy bouquet with soft musk — elegant and long-lasting.",
    price: 299,
    category: "Women's Perfume",
    image: "/Products/Rose.jpg",
    stock: 120,
    rating: 4.6,
    numReviews: 118,
  },
  {
    name: "Burberry Weekend (30ml)",
    description: "A fresh, breezy daytime scent with citrus and green accords.",
    price: 549,
    category: "Unisex",
    image: "/Products/Burberry%20Weekends.jpg",
    stock: 60,
    rating: 4.5,
    numReviews: 42,
  },
  {
    name: "Blueberry (30ml)",
    description:
      "Fruity blueberry top notes balanced with a soft floral heart.",
    price: 279,
    category: "Women's Perfume",
    image: "/Products/BLueberry.jpg",
    stock: 90,
    rating: 4.4,
    numReviews: 27,
  },
  {
    name: "Sabaya (30ml)",
    description:
      "Oriental floral with rich amber and vanilla — sensual and warm.",
    price: 699,
    category: "Luxury",
    image: "/Products/Sabaya.jpg",
    stock: 35,
    rating: 4.85,
    numReviews: 51,
  },
  {
    name: "Mogra (30ml)",
    description: "Pure mogra (jasmine) heart — bright, floral and timeless.",
    price: 329,
    category: "Women's Perfume",
    image: "/Products/Mogra.jpg",
    stock: 110,
    rating: 4.6,
    numReviews: 73,
  },
  {
    name: "Blue Lady (30ml)",
    description: "A modern feminine scent with marine and floral touches.",
    price: 379,
    category: "Women's Perfume",
    image: "/Products/Blue%20Lady.jpg",
    stock: 55,
    rating: 4.5,
    numReviews: 21,
  },
  {
    name: "24 Carat (30ml)",
    description: "Opulent golden accord with saffron, oud and a velvety base.",
    price: 999,
    category: "Luxury",
    image: "/Products/24%20Carat.jpg",
    stock: 18,
    rating: 4.95,
    numReviews: 39,
  },
  {
    name: "Russia (30ml)",
    description: "A deep, woody oriental with smoky oud and leather nuances.",
    price: 799,
    category: "Luxury",
    image: "/Products/Rusia.jpg",
    stock: 28,
    rating: 4.8,
    numReviews: 46,
  },
  {
    name: "Lacoste White (30ml)",
    description: "Clean, sporty and airy — a crisp casual fragrance.",
    price: 499,
    category: "Unisex",
    image: "/Products/Lacoste%20White.jpg",
    stock: 95,
    rating: 4.4,
    numReviews: 54,
  },
  {
    name: "Hot Oudh (30ml)",
    description: "A powerfully resinous oudh with spicy and smoky facets.",
    price: 649,
    category: "Luxury",
    image: "/Products/Hot%20Oudh.jpg",
    stock: 40,
    rating: 4.7,
    numReviews: 61,
  },
  {
    name: "Vanity Femme Celebration (30ml)",
    description:
      "Festive floral gourmand designed for celebrations and nights out.",
    price: 579,
    category: "Women's Perfume",
    image: "/Products/Vanity%20Femme.jpg",
    stock: 44,
    rating: 4.6,
    numReviews: 29,
  },
  {
    name: "Signature Oudh (30ml)",
    description: "A signature oud blend with creamy woods and a warm finish.",
    price: 899,
    category: "Luxury",
    image: "/Products/Signature%20oudh.jpg",
    stock: 22,
    rating: 4.9,
    numReviews: 68,
  },
  {
    name: "Rida Diamond (30ml)",
    description: "A sparkling floral gourmand with creamy vanilla and almond.",
    price: 749,
    category: "Luxury",
    image: "/Products/Rida%20Daimond.jpg",
    stock: 26,
    rating: 4.8,
    numReviews: 33,
  },
  {
    name: "Japanese Cherry (30ml)",
    description:
      "Cherry blossom inspired — soft, airy and evocative of spring.",
    price: 319,
    category: "Women's Perfume",
    image: "/Products/Japanse%20Cherry.jpg",
    stock: 88,
    rating: 4.5,
    numReviews: 17,
  },
  {
    name: "Peach (30ml)",
    description:
      "Juicy peach top notes with a soft musky base — playful and fresh.",
    price: 249,
    category: "Women's Perfume",
    image: "/Products/Peach.jpg",
    stock: 130,
    rating: 4.3,
    numReviews: 22,
  },
  {
    name: "Purple Oudh (30ml)",
    description: "A modern oudh with floral top notes and a rich woody base.",
    price: 599,
    category: "Luxury",
    image: "/Products/Purple%20Oudh.jpg",
    stock: 48,
    rating: 4.6,
    numReviews: 38,
  },
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce"
    );
    console.log("Connected to MongoDB");

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log("Cleared existing data");

    // Create admin user
    const adminUser = new User({
      name: "Admin User",
      email: "admin@ramvatika.com",
      password: "admin123",
      role: "admin",
    });
    await adminUser.save();
    console.log("Created admin user (admin@ramvatika.com / admin123)");

    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log("Inserted sample products");

    console.log("Database seeded successfully!");
    console.log("Admin credentials: admin@ramvatika.com / admin123");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
