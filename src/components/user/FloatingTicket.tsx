"use client";
import { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

export default function FloatingTicket() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-4 bg-white z-50 text-gray-800 px-5 py-3 rounded-lg shadow-2xl border border-gray-700 flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 w-[90%] sm:w-auto max-w-sm sm:max-w-none transition-all duration-300">
  
      {/* 🏆 Texto descriptivo */}
      <span className="text-sm sm:text-lg font-semibold tracking-wide text-center sm:text-left">
        🎫 Participa en nuestro asombroso sorteo mobiliario.
      </span>
  
      {/* 🎟️ Botón de comprar ticket */}
      <Link
        href="/tickets"
        className="btn-primary hover:bg-secondary-hover text-white px-4 sm:px-5 py-2 text-sm font-bold rounded-lg transition-all w-full sm:w-auto text-center"
      >
        Comprar Ticket Digital
      </Link>
  
      {/* ❌ Botón de cerrar */}
      <button
        onClick={() => setVisible(false)}
        aria-label="Cerrar"
        className="p-2 rounded-full hover:bg-gray-200 transition absolute top-2 right-2 sm:static sm:ml-auto"
      >
        <X className="w-5 h-5 opacity-80 hover:opacity-100 transition" />
      </button>
  
    </div>
  );
  
  
  
}
