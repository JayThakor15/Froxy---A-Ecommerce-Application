import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Smartphone, 
  Shirt, 
  BookOpen, 
  Home, 
  Dumbbell, 
  Heart, 
  Gamepad2, 
  Car 
} from 'lucide-react';

const categories = [
  {
    name: 'Electronics',
    icon: Smartphone,
    color: 'bg-blue-100 text-blue-600',
    href: '/products?category=Electronics'
  },
  {
    name: 'Clothing',
    icon: Shirt,
    color: 'bg-pink-100 text-pink-600',
    href: '/products?category=Clothing'
  },
  {
    name: 'Books',
    icon: BookOpen,
    color: 'bg-green-100 text-green-600',
    href: '/products?category=Books'
  },
  {
    name: 'Home & Garden',
    icon: Home,
    color: 'bg-yellow-100 text-yellow-600',
    href: '/products?category=Home & Garden'
  },
  {
    name: 'Sports',
    icon: Dumbbell,
    color: 'bg-red-100 text-red-600',
    href: '/products?category=Sports'
  },
  {
    name: 'Beauty',
    icon: Heart,
    color: 'bg-purple-100 text-purple-600',
    href: '/products?category=Beauty'
  },
  {
    name: 'Toys',
    icon: Gamepad2,
    color: 'bg-orange-100 text-orange-600',
    href: '/products?category=Toys'
  },
  {
    name: 'Automotive',
    icon: Car,
    color: 'bg-gray-100 text-gray-600',
    href: '/products?category=Automotive'
  }
];

const CategorySection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover products from our wide range of categories, carefully curated for your needs
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Link
                key={category.name}
                to={category.href}
                className="group flex flex-col items-center p-6 rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-lg transition-all duration-200 bg-white"
              >
                <div className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <IconComponent className="h-8 w-8" />
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
