// context/CartContext.tsx
"use client";

import React, { createContext, useContext, useState } from "react";

interface Ticket {
  id: number;
  
  premio: string;
  min_number?: number;
  max_number?: number;
  date?: string;
  time?: string;
  costo: number;
  image_url?: string;
}

interface CartContextProps {
  cart: Ticket[];
  addToCart: (ticket: Ticket) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextProps>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  // Aquí el estado arranca con un ticket de prueba
  const [cart, setCart] = useState<Ticket[]>([
    {
      id: 2,
      premio: "Ticket de prueba",
      costo: 1000,
      min_number: 1,
      max_number: 10,
      date: "2025-03-01",
      time: "10:00",
      image_url: "https://via.placeholder.com/300x200" // opcional
    },
  ]);

  const addToCart = (ticket: Ticket) => {
    setCart((prev) => [...prev, ticket]);
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
