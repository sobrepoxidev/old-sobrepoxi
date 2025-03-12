// context/CartContext.tsx
"use client";

import React, { createContext, useContext, useState } from "react";
import { Database } from '@/types-db';

type UsertTicket = Database['user_tickets'];

interface CartContextProps {
  cart: UsertTicket[];
  addToCart: (ticket: UsertTicket) => void;
  addNumberAndSerieToCart: (local_id: number, number: number, serie: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  cartBuyed: UsertTicket[];
  addToCartBuyed: (ticket: UsertTicket) => void;
  addManyToCartBuyed: (tickets: UsertTicket[]) => void
  removeFromCartBuyed: (id: number) => void;
  clearCartBuyed: () => void;
}

const CartContext = createContext<CartContextProps>({
  cart: [],
  addToCart: () => {},
  addNumberAndSerieToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  cartBuyed: [],
  addToCartBuyed: () => {},
  addManyToCartBuyed:() => {},
  removeFromCartBuyed: () => {},
  clearCartBuyed: () => {},

});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  // Aquí el estado arranca con un ticket de prueba
  const [cart, setCart] = useState<UsertTicket[]>([
  //  {
  //     id: 6,
  //     local_id: 200,
  //     name: "Ticket Dorado", // Nombre del ticket
  //     ticket_type_id: null,
  //     user_id: null,
  //     number: null,
  //     serie: null,
  //     premio: "Ticket de prueba",
  //     costo: 1000,
  //     is_locked: false,
  //     purchase_date: null,
  //     custom_design: null,
  //     created_at: new Date().toISOString(),
  //     order_id: null,
  //     image_url:
  //       "https://nvnsptdwijqnetahaojg.supabase.co/storage/v1/object/public/tickets_images//sorteo_1.webp",
  //     min_serie: 0,
  //     max_serie: 999,
  //     min_number: 1,
  //     max_number: 99,
  //     date: "2025-03-06",
  //     time: "10:00",
  //   },
  ]);
  // Aquí el estado arranca con un ticket de prueba
  const [cartBuyed, setCartBuyed] = useState<UsertTicket[]>([
    // {
    //   id: 5,
    //   local_id: 200,
    //   name: "Ticket Dorado", // Nombre del ticket
    //   ticket_type_id: null,
    //   user_id: null,
    //   number: 7,
    //   serie: 999,
    //   premio: "Ticket de prueba",
    //   costo: 1000,
    //   is_locked: false,
    //   purchase_date: null,
    //   custom_design: null,
    //   created_at: new Date().toISOString(),
    //   order_id: null,
    //   image_url:
    //     "https://nvnsptdwijqnetahaojg.supabase.co/storage/v1/object/public/tickets_images//sorteo_1.webp",
    //   min_serie: 0,
    //   max_serie: 999,
    //   min_number: 1,
    //   max_number: 99,
    //   date: "2025-03-23",
    //   time: "19:00",
    // },
    // {
    //   id: 5,
    //   local_id: 201,
    //   name: "Ticket Dorado",
    //   ticket_type_id: null,
    //   user_id: null,
    //   number: 8,
    //   serie: 1,
    //   premio: "Ticket de prueba 2",
    //   costo: 1000,
    //   is_locked: false,
    //   purchase_date: null,
    //   custom_design: null,
    //   created_at: new Date().toISOString(),
    //   order_id: null,
    //   image_url:
    //     "https://nvnsptdwijqnetahaojg.supabase.co/storage/v1/object/public/tickets_images//sorteo_4.webp",
    //   min_serie: 0,
    //   max_serie: 999,
    //   min_number: 1,
    //   max_number: 99,
    //   date: "2025-03-16",
    //   //time 17:00
    //   time: "20:00",

    // },
  ]);
  

  const addToCart = (ticket: UsertTicket) => {
    setCart((prev) => [...prev, ticket]);
  };

  const addNumberAndSerieToCart = (local_id: number, number: number, serie: number) => {
    setCart((prev) => prev.map((item) => {
      if (item.local_id === local_id) {
        return {
          ...item,
          number,
          serie
        }
      }
      return item;
    }));
  };

  const removeFromCart = (local_id: number) => {
    setCart((prev) => prev.filter((item) => item.local_id !== local_id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const addToCartBuyed = (ticket: UsertTicket) => {
    setCartBuyed((prev) => [...prev, ticket]);
  };

  const addManyToCartBuyed = (tickets: UsertTicket[]) => {
    setCartBuyed((prev) => [...prev, ...tickets]);
  };

  const removeFromCartBuyed = (local_id: number) => {
    setCartBuyed((prev) => prev.filter((item) => item.local_id !== local_id));
  };

  const clearCartBuyed = () => {
    setCartBuyed([]);
  };

  return (
    <CartContext.Provider value={{ cart, cartBuyed, addToCart, addNumberAndSerieToCart, removeFromCart, clearCart, addToCartBuyed, removeFromCartBuyed, clearCartBuyed, addManyToCartBuyed}}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
