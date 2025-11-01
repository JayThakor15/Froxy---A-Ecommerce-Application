import React from "react";
import { Link } from "react-router-dom";
// removed unused lucide import

const categories = [
  {
    name: "Women's Perfume",
    color: "bg-primary-50 text-primary-700",
    image: "Women.png",
    href: "/products?category=Women%27s%20Perfume",
  },
  {
    name: "Men's Cologne",
    color: "bg-primary-100 text-primary-800",
    image: "Men.png",
    href: "/products?category=Men%27s%20Cologne",
  },
  {
    name: "Unisex",
    color: "bg-gold-50 text-gold-700",
    image: "Unisex.png",
    href: "/products?category=Unisex",
  },
  {
    name: "Luxury",
    color: "bg-gold-100 text-gold-800",
    image: "Gift.png",
    href: "/products?category=Luxury",
  },
  {
    name: "Home Fragrance",
    color: "bg-primary-50 text-primary-700",
    image: "Home.png",
    href: "/products?category=Home%20Fragrance",
  },
  {
    name: "Gift Sets",
    color: "bg-gold-50 text-gold-800",
    image: "Gift.png",
    href: "/products?category=Gift%20Set",
  },
  {
    name: "Travel Sprays",
    color: "bg-richBlack-100 text-richBlack-800",
    image: "Travel.png",
    href: "/products?category=Travel%20Set",
  },
  {
    name: "New Arrivals",
    color: "bg-primary-200 text-primary-800",
    image: "New.png",
    href: "/products?category=New%20Arrivals",
  },
];

// Simple perfume bottle SVG used as category logo — uses currentColor for flexible tinting
const PerfumeIcon = ({ className = "h-8 w-8" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect x="7" y="7" width="10" height="11" rx="2" />
    <path d="M9 7V5a3 3 0 0 1 6 0v2" />
    <path d="M12 18v1" />
  </svg>
);

const CategorySection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover products from our wide range of categories, carefully
            curated for your needs
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
          {categories.map((category) => {
            return (
              <Link
                key={category.name}
                to={category.href}
                className="group flex flex-col items-center p-6 rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-lg transition-all duration-200 bg-white"
              >
                <div
                  className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}
                >
                  {/* Inner fixed box ensures all logos render at the same visible size */}
                  <div className="w-10 h-10 flex items-center justify-center">
                    <img
                      src={`/Catagory/${category.image}`}
                      alt={`${category.name} logo`}
                      className="max-w-full max-h-full"
                    />
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900 text-center group-hover:text-primary-600 transition-colors">
                  {category.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
