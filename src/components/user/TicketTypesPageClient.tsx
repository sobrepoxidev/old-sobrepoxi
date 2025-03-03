"use client";

import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { useCart } from "@/components/context/CartContext";
import Link from "next/link";

interface Ticket {
  id: number;
  premio: string;
  min_number: number;
  max_number: number;
  date: string;
  time: string;
  costo: number;
  image_url?: string;
}

interface SessionType {
  user?: {
    user_metadata?: {
      full_name?: string;
    };
  };
}

interface TicketTypesPageClientProps {
  ticketTypes: Ticket[];
}

export default function TicketTypesPageClient({
  ticketTypes,
}: TicketTypesPageClientProps) {
  const { cart, addToCart } = useCart();
  const cartCount = cart.length;


  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-0 mt-0">
      {/* Encabezado y carrito */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            PoxCards Disponibles
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Compra tu poxcard, personalizalo y participa por grandes premios.
          </p>
        </div>

        {/* Botón Carrito */}
        <Link
          className="flex items-center  gap-2 bg-yellow-400 text-gray-800 px-4 py-2 rounded-md font-bold shadow hover:shadow-lg transition"
          href="/poxcards/checkout"
        >
          <span className="text-xl">🛒</span>
          <span>Carrito ({cartCount})</span>
        </Link>
      </header>

      {/* Grilla de Tickets */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {ticketTypes.map((ticket) => (
          <div
            key={ticket.id}
            className="relative overflow-hidden rounded-lg shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 transition-transform duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            {/* Badge de marca */}
            <div className="absolute top-2 left-2 z-10 bg-indigo-600 bg-opacity-90 text-white px-3 py-1 rounded-md text-xs font-semibold backdrop-blur-md">
              Sobrepoxi
            </div>

            {/* Imagen del premio */}
            <div className="relative w-full h-40 rounded-md overflow-hidden">
              {ticket.image_url ? (
                <Image
                  src={ticket.image_url}
                  alt={ticket.premio}
                  fill
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <div className="w-full h-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                  📷 Sin imagen
                </div>
              )}
            </div>

            {/* Contenido de la tarjeta */}
            <div className="mt-4 space-y-2">
              {/* 1) Título/Premio */}
              <h2 className="text-lg md:text-xl font-bold text-indigo-600 dark:text-indigo-400">
                {ticket.premio}
              </h2>

              {/* 2) Fila con Número y Serie (2 columnas en pantallas medianas) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm">
                <div>
                  <span className="font-semibold">Número: </span>
                  <span className="text-indigo-600 dark:text-indigo-400">
                    {ticket.min_number} - {ticket.max_number}
                  </span>
                </div>
                <div>
                  <span className="font-semibold">Serie: </span>
                  <span className="text-indigo-600 dark:text-indigo-400">
                    000 - 999
                  </span>
                </div>
              </div>

              {/* 3) Fila con Fecha y Hora (2 columnas en pantallas medianas) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm">
                <div>
                  <span className="font-semibold">Fecha: </span>
                  <span>{ticket.date}</span>
                </div>
                <div>
                  <span className="font-semibold">Hora: </span>
                  <span>{ticket.time.slice(0, 5)}</span>
                </div>
              </div>

              {/* 4) Fila con precio a la izquierda y QR a la derecha (centrados) */}
              <div className="flex flex-col sm:flex-row  justify-between mt-3">
                {/* Contenedor del Precio */}
                <div className="flex-1 flex justify-start items-start">
                  <p className="text-base md:text-lg font-semibold text-green-600 dark:text-green-400">
                    ₡{ticket.costo}
                  </p>
                </div>

                {/* Contenedor del QR */}
                <div className="mt-3 sm:mt-0 flex-1 flex justify-center items-center">
                  <QRCodeSVG value="https://example.com/ticket" size={40} />
                </div>
              </div>

            </div>

            {/* Botones */}
            <div className="mt-4 flex flex-col gap-2">
              <Link
                href={`/poxcards/${ticket.id}`}
                className="block w-full text-center font-semibold text-indigo-600 border border-indigo-600 px-4 py-2 rounded-md transition hover:bg-indigo-600 hover:text-white"
              >
                Ver Detalles
              </Link>

              <button
                onClick={() => addToCart(ticket)}
                className="w-full inline-flex items-center justify-center font-semibold text-white bg-indigo-600 px-4 py-2 rounded-md transition hover:bg-indigo-500"
              >
                Agregar al Carrito
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
