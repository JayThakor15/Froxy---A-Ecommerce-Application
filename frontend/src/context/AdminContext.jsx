import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { apiUrl } from "../utils/api";
import toast from "react-hot-toast";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(apiUrl("/api/products?limit=100"));
      setProducts(response.data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData) => {
    try {
      setLoading(true);
      const response = await axios.post(apiUrl("/api/products"), productData);
      setProducts((prev) => [response.data, ...prev]);
      toast.success("Product created successfully!");
      return { success: true, product: response.data };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to create product";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (productId, productData) => {
    try {
      setLoading(true);
      const response = await axios.put(
        apiUrl(`/api/products/${productId}`),
        productData
      );
      setProducts((prev) =>
        prev.map((product) =>
          product._id === productId ? response.data : product
        )
      );
      toast.success("Product updated successfully!");
      return { success: true, product: response.data };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update product";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    try {
      setLoading(true);
      await axios.delete(apiUrl(`/api/products/${productId}`));
      setProducts((prev) =>
        prev.filter((product) => product._id !== productId)
      );
      toast.success("Product deleted successfully!");
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to delete product";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(apiUrl("/api/admin/stats"));
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      toast.error("Failed to fetch admin statistics");
    }
  };

  return (
    <AdminContext.Provider
      value={{
        products,
        loading,
        stats,
        fetchProducts,
        createProduct,
        updateProduct,
        deleteProduct,
        fetchStats,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
