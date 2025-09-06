import React, { useEffect, useState } from "react";
import Hero from "../components/Hero";
import CategorySection from "../components/CategorySection";
import FeaturedProducts from "../components/FeaturedProducts";
import Footer from "../components/Footer";

const Home = () => {
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={
        isDark ? "min-h-screen bg-gray-900 text-gray-100" : "min-h-screen"
      }
    >
      <Hero />
      <CategorySection />
      <FeaturedProducts />
      {/* <Footer /> */}
    </div>
  );
};

export default Home;
