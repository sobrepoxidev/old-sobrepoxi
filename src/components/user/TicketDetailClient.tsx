"use client";

import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { useCart } from "@/components/context/CartContext";
import Link from "next/link";

import { Database } from '@/types-db';

type TypeTicket = Database['ticket_types'];
type UsertTicket = Database['user_tickets'];



interface TicketDetailClientProps {
  ticketType: TypeTicket;
}

let counterId = 1000;

export default function TicketDetailClient({ ticketType }: TicketDetailClientProps) {
  const { cart, addToCart } = useCart();
  const cartCount = cart.length;

  const fecha = ticketType.date;
  const hora = ticketType.time?.slice(0, 5);

  const addUserCart = (ticket: TypeTicket) => {
    //crea un nuevo user ticket
    const newUserTicket: UsertTicket = {
      id : ticket.id,
      local_id: counterId,
      name: ticket.premio, // Nombre del ticket
      ticket_type_id: null,
      user_id: null,
      number: null,
      serie: null,
      premio: ticket.premio,
      costo: ticket.costo,
      is_locked: false,
      purchase_date: null,
      custom_design: null,
      order_id: null,
      image_url: ticket.image_url, // opcional
      min_serie: ticket.min_serie,
      max_serie: ticket.max_serie,
      min_number: ticket.min_number,
      max_number: ticket.max_number,
      date: ticket.date,
      time: ticket.time,
    };
    counterId += 1;
    addToCart(newUserTicket);
  }

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-8">
      {/* Encabezado con título y carrito */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Detalles del PoxCard
          </h1>
        </div>
        <Link
          className="flex items-center gap-2 bg-yellow-400 text-gray-800 px-4 py-2 
                     rounded-md font-bold shadow hover:shadow-lg transition"
          href="/poxicards/checkout"
        >
          <span className="text-xl">🛒</span>
          <span>Carrito ({cartCount})</span>
        </Link>
      </header>

      {/* Tarjeta de detalle */}
      <div className="mx-auto max-w-md bg-white dark:bg-gray-900 border 
                      border-gray-200 dark:border-gray-700 rounded-lg shadow-md p-4 relative">
        {/* Badge de marca */}
        <div className="absolute top-2 left-2 z-10 bg-indigo-600 
                        bg-opacity-90 text-white px-3 py-1 rounded-md text-xs font-semibold backdrop-blur-md">
          Sobrepoxi
        </div>

        {/* Imagen */}
        <div className="relative w-full h-40 rounded-md overflow-hidden">
          {ticketType.image_url ? (
            <Image
              src={ticketType.image_url}
              alt={`Ticket de ${ticketType.name}`}
              fill
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div className="w-full h-full bg-gray-300 dark:bg-gray-700 
                            flex items-center justify-center text-gray-500 dark:text-gray-400">
              📷 Sin imagen
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="mt-4 space-y-2">
          <h2 className="text-sm md:text-base font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wide">
            {ticketType.name || "TICKET DORADO"}
          </h2>

          <h3 className="text-xl md:text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {ticketType.premio}
          </h3>

          {/* Número y Serie */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm">
            <div>
              <span className="font-semibold">Número: </span>
              <span className="text-indigo-600 dark:text-indigo-400">
                #{ticketType.min_number} - {ticketType.max_number}
              </span>
            </div>
            <div>
              <span className="font-semibold">Serie: </span>
              <span className="text-indigo-600 dark:text-indigo-400">000 - 999</span>
            </div>
          </div>

          {/* Fecha y hora */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm">
            <div>
              <span className="font-semibold">Fecha: </span>
              <span>{fecha}</span>
            </div>
            <div>
              <span className="font-semibold">Hora: </span>
              <span>{hora}</span>
            </div>
          </div>

          {/* Precio + QR */}
          <div className="flex flex-col sm:flex-row justify-between mt-3">
            <div className="flex-1 flex items-start">
              <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                ₡{ticketType.costo}
              </p>
            </div>
            <div className="mt-3 sm:mt-0 flex-1 flex justify-center items-center">
              <QRCodeSVG value="https://example.com/ticket" size={50} />
            </div>
          </div>
        </div>
      </div>

      {/* Botones de acción (Carrito y Regresar) */}
      <div className="mx-auto max-w-md mt-4 flex flex-col sm:flex-row gap-2">
        <button
          onClick={() => addUserCart(ticketType)}
          className="w-full inline-flex items-center justify-center font-semibold 
                     text-white bg-indigo-600 px-4 py-2 rounded-md transition 
                     hover:bg-indigo-500"
        >
          Agregar al Carrito
        </button>

        <Link
          href="/poxcards/ver-poxcards"
          className="w-full text-center font-semibold text-indigo-600 
                     border border-indigo-600 px-4 py-2 rounded-md transition 
                     hover:bg-indigo-600 hover:text-white"
        >
          Regresar
        </Link>
      </div>

      {/* Mensajes */}
      <div className="mx-auto max-w-md">
        <div className="mt-6 p-3 bg-blue-100 dark:bg-blue-900 text-center 
                        text-blue-700 dark:text-blue-300 rounded-lg text-sm">
          🔓 Una vez realizado el pago, podrás personalizar y descargar tu ticket digital.
        </div>

        <div className="mt-4 p-3 bg-rose-100 dark:bg-rose-900 text-center 
                        text-rose-700 dark:text-rose-300 rounded-lg text-sm">
          ⚠️ En el futuro se comprobará la legitimidad de tu pago...
        </div>
      </div>
    </main>
  );
}
