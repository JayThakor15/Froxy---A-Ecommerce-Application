import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

const initialState = {
  items: [],
  loading: false,
  error: null
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'CART_LOADING':
      return { ...state, loading: true, error: null };
    case 'CART_SUCCESS':
      return { ...state, items: action.payload, loading: false, error: null };
    case 'CART_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'ADD_TO_CART':
      return { ...state, items: action.payload, loading: false };
    case 'UPDATE_CART':
      return { ...state, items: action.payload, loading: false };
    case 'REMOVE_FROM_CART':
      return { ...state, items: action.payload, loading: false };
    case 'CLEAR_CART':
      return { ...state, items: [], loading: false };
    case 'LOAD_LOCAL_CART':
      return { ...state, items: action.payload };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { user, token } = useAuth();

  // Load cart from server when user logs in
  useEffect(() => {
    if (user && token) {
      loadCart();
    } else {
      // Load from localStorage when not logged in
      loadLocalCart();
    }
  }, [user, token]);

  const loadCart = async () => {
    try {
      dispatch({ type: 'CART_LOADING' });
      const res = await axios.get('/api/cart');
      dispatch({ type: 'CART_SUCCESS', payload: res.data });
    } catch (error) {
      dispatch({ type: 'CART_ERROR', payload: 'Failed to load cart' });
    }
  };

  const loadLocalCart = () => {
    const localCart = localStorage.getItem('cart');
    if (localCart) {
      try {
        const cartItems = JSON.parse(localCart);
        dispatch({ type: 'LOAD_LOCAL_CART', payload: cartItems });
      } catch (error) {
        console.error('Error loading local cart:', error);
      }
    }
  };

  const saveLocalCart = (items) => {
    localStorage.setItem('cart', JSON.stringify(items));
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      if (user && token) {
        // Add to server cart
        const res = await axios.post('/api/cart', { productId, quantity });
        dispatch({ type: 'ADD_TO_CART', payload: res.data });
        toast.success('Added to cart!');
      } else {
        // Add to local cart
        const existingItem = state.items.find(item => item.product._id === productId);
        let newItems;
        
        if (existingItem) {
          newItems = state.items.map(item =>
            item.product._id === productId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          // For local cart, we need to fetch product details
          const productRes = await axios.get(`/api/products/${productId}`);
          newItems = [...state.items, { product: productRes.data, quantity }];
        }
        
        dispatch({ type: 'ADD_TO_CART', payload: newItems });
        saveLocalCart(newItems);
        toast.success('Added to cart!');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add to cart';
      toast.error(message);
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      if (user && token) {
        const res = await axios.put(`/api/cart/${productId}`, { quantity });
        dispatch({ type: 'UPDATE_CART', payload: res.data });
      } else {
        const newItems = state.items.map(item =>
          item.product._id === productId
            ? { ...item, quantity }
            : item
        ).filter(item => item.quantity > 0);
        
        dispatch({ type: 'UPDATE_CART', payload: newItems });
        saveLocalCart(newItems);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update cart';
      toast.error(message);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      if (user && token) {
        const res = await axios.delete(`/api/cart/${productId}`);
        dispatch({ type: 'REMOVE_FROM_CART', payload: res.data });
        toast.success('Removed from cart');
      } else {
        const newItems = state.items.filter(item => item.product._id !== productId);
        dispatch({ type: 'REMOVE_FROM_CART', payload: newItems });
        saveLocalCart(newItems);
        toast.success('Removed from cart');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove from cart';
      toast.error(message);
    }
  };

  const clearCart = async () => {
    try {
      if (user && token) {
        await axios.delete('/api/cart');
        dispatch({ type: 'CLEAR_CART' });
      } else {
        dispatch({ type: 'CLEAR_CART' });
        localStorage.removeItem('cart');
      }
      toast.success('Cart cleared');
    } catch (error) {
      toast.error('Failed to clear cart');
    }
  };

  const getCartTotal = () => {
    return state.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  const getCartItemsCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartItemsCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
