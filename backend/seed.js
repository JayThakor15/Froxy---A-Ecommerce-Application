const mongoose = require("mongoose");
const Product = require("./models/Product");
const User = require("./models/User");
require("dotenv").config();

const sampleProducts = [
  {
    name: "iPhone 15 Pro",
    description:
      "The latest iPhone with advanced camera system, A17 Pro chip, and titanium design. Features a 6.1-inch Super Retina XDR display with ProMotion technology.",
    price: 999,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    stock: 50,
    rating: 4.8,
    numReviews: 1250,
  },
  {
    name: "MacBook Pro 16-inch",
    description:
      "Powerful laptop with M3 Pro chip, 16-inch Liquid Retina XDR display, and all-day battery life. Perfect for professionals and creatives.",
    price: 2499,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    stock: 25,
    rating: 4.9,
    numReviews: 890,
  },
  {
    name: "Nike Air Max 270",
    description:
      "Comfortable running shoes with Max Air cushioning and breathable mesh upper. Perfect for daily wear and light exercise.",
    price: 150,
    category: "Clothing",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    stock: 100,
    rating: 4.5,
    numReviews: 320,
  },
  {
    name: "Levi's 501 Original Jeans",
    description:
      "Classic straight-fit jeans made from 100% cotton denim. Timeless style that never goes out of fashion.",
    price: 89,
    category: "Clothing",
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    stock: 75,
    rating: 4.3,
    numReviews: 180,
  },
  {
    name: "The Great Gatsby",
    description:
      "F. Scott Fitzgerald's masterpiece about the Jazz Age. A timeless classic that explores themes of wealth, love, and the American Dream.",
    price: 12,
    category: "Books",
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    stock: 200,
    rating: 4.7,
    numReviews: 450,
  },
  {
    name: "Atomic Habits",
    description:
      "James Clear's guide to building good habits and breaking bad ones. A practical framework for improving your life one small step at a time.",
    price: 18,
    category: "Books",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    stock: 150,
    rating: 4.6,
    numReviews: 280,
  },
  {
    name: "Philips Hue Smart Bulb",
    description:
      "Smart LED bulb that can change colors and be controlled via smartphone app. Compatible with Alexa and Google Assistant.",
    price: 45,
    category: "Home & Garden",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    stock: 80,
    rating: 4.4,
    numReviews: 120,
  },
  {
    name: "Yoga Mat Premium",
    description:
      "Non-slip yoga mat made from eco-friendly materials. Perfect for yoga, pilates, and other fitness activities.",
    price: 35,
    category: "Sports",
    image:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    stock: 60,
    rating: 4.5,
    numReviews: 95,
  },
  {
    name: "Dumbbell Set 20lbs",
    description:
      "Adjustable dumbbell set perfect for home workouts. Includes multiple weight plates and comfortable grips.",
    price: 89,
    category: "Sports",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    stock: 40,
    rating: 4.2,
    numReviews: 75,
  },
  {
    name: "Skincare Set",
    description:
      "Complete skincare routine with cleanser, toner, and moisturizer. Made with natural ingredients for all skin types.",
    price: 65,
    category: "Beauty",
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    stock: 90,
    rating: 4.6,
    numReviews: 140,
  },
  {
    name: "LEGO Creator Set",
    description:
      "Build and rebuild three different models with this creative LEGO set. Perfect for kids and adults who love building.",
    price: 55,
    category: "Toys",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    stock: 120,
    rating: 4.8,
    numReviews: 200,
  },
  {
    name: "Car Phone Mount",
    description:
      "Magnetic phone mount for your car dashboard. Strong magnetic hold with 360-degree rotation and easy installation.",
    price: 25,
    category: "Automotive",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    stock: 110,
    rating: 4.3,
    numReviews: 85,
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
      email: "admin@froxy.com",
      password: "admin123",
      role: "admin",
    });
    await adminUser.save();
    console.log("Created admin user (admin@froxy.com / admin123)");

    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log("Inserted sample products");

    console.log("Database seeded successfully!");
    console.log("Admin credentials: admin@froxy.com / admin123");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
