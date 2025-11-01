import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Truck, Shield, Headphones } from "lucide-react";

const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Ram Vatika
                <span className="block text-2xl md:text-3xl font-semibold text-accent-500">
                  Love at First Smell
                </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Handcrafted fragrances inspired by timeless traditions and
                modern elegance. Each Ram Vatika scent is carefully composed to
                evoke memories, spark joy, and leave a lasting impression — a
                sensory journey in every 30ml bottle.
              </p>

              <p className="text-md text-gray-500 max-w-2xl">
                Explore artisanal blends of saffron, oud, jasmine and fresh
                orchards — designed for everyday luxury and special moments.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/products"
                className="inline-flex items-center justify-center px-8 py-4 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 transition-colors duration-200 group"
              >
                Shop Ram Vatika
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/products?category=New%20Arrivals"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-primary-600 text-primary-600 font-semibold rounded-lg hover:bg-primary-600 hover:text-white transition-colors duration-200"
              >
                Explore Collections
              </Link>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Truck className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Free Shipping
                  </p>
                  <p className="text-xs text-gray-600">On orders over ₹999</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Shield className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Secure Payment
                  </p>
                  <p className="text-xs text-gray-600">100% protected</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Headphones className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    24/7 Support
                  </p>
                  <p className="text-xs text-gray-600">Always here to help</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src="/Hero Section Side Image.png"
                alt="Ram Vatika perfume bottle"
                className="rounded-2xl shadow-2xl w-full object-cover"
              />
            </div>

            {/* Floating Cards */}
            <div className="absolute -top-6 -left-6 bg-white rounded-lg shadow-lg p-4 z-20">
              <div className="flex items-center space-x-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 bg-primary-100 rounded-full border-2 border-white flex items-center justify-center"
                    >
                      <Star className="h-4 w-4 text-primary-600 fill-current" />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">4.9/5</p>
                  <p className="text-xs text-gray-600">Customer Rating</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-6 bg-white rounded-lg shadow-lg p-4 z-20">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-600">10K+</p>
                <p className="text-sm text-gray-600">Happy Customers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
