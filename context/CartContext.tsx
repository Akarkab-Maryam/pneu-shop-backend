'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: number;
  nom: string;
  dimensions: string;
  prix: number;
  quantite: number;
  image: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantite'>, quantite?: number) => void;
  removeFromCart: (id: number) => void;
  updateQuantite: (id: number, quantite: number) => void;
  clearCart: () => void;
  totalArticles: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'pneu_shop_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [charge, setCharge] = useState(false);

  // Charger le panier depuis localStorage au montage
  useEffect(() => {
    const sauvegarde = localStorage.getItem(CART_STORAGE_KEY);
    if (sauvegarde) {
      try {
        setCart(JSON.parse(sauvegarde));
      } catch (e) {
        console.error('Panier corrompu, réinitialisation.', e);
      }
    }
    setCharge(true);
  }, []);

  // Sauvegarder à chaque changement (une fois le chargement initial fait)
  useEffect(() => {
    if (charge) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart, charge]);

  const addToCart = (item: Omit<CartItem, 'quantite'>, quantite: number = 1) => {
    setCart((prev) => {
      const existant = prev.find((i) => i.id === item.id);
      if (existant) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantite: i.quantite + quantite } : i
        );
      }
      return [...prev, { ...item, quantite }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantite = (id: number, quantite: number) => {
    if (quantite < 1) return;
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, quantite } : i)));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalArticles = cart.reduce((acc, item) => acc + item.quantite, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.prix * item.quantite, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantite, clearCart, totalArticles, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart doit être utilisé à l\'intérieur d\'un CartProvider');
  }
  return context;
}