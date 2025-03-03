"use client";
import { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

export default function FloatingTicket() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="fixed bottom-8 right-6 bg-white opacity-100  z-50 text-gray-800 px-6 py-4 rounded-lg shadow-2xl border border-gray-700 flex items-center space-x-4 transition-all duration-300">
      <span className="text-lg font-semibold tracking-wide">
      🎫 Participación gratuita en el sorteo sorteo mobiliario por la compra de tu ticket.
      </span>

      <Link
        href="/tickets"
        className="btn-primary hover:bg-secondary-hover text-gray-800 px-5 py-2 text-sm font-bold rounded-lg transition-all"
      >
        Comprar Ticket Digital
      </Link>

      <button
        onClick={() => setVisible(false)}
        aria-label="Cerrar"
        className="p-1 rounded-full hover:bg-white/20 transition"
      >
        <X className="w-5 h-5  opacity-80 hover:opacity-100 transition" />
      </button>
    </div>
  );
}
