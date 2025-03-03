// src/app/tickets/page.tsx

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function TicketTypesPage() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data: ticketTypes, error } = await supabase.from('ticket_types').select('*');

  if (error) {
    return (
      <main className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-10 text-red-500">
        Error al cargar: {error.message}
      </main>
    );
  }

  if (!ticketTypes || ticketTypes.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">🎟️ Sorteos Actuales</h1>
        <p className="text-gray-700 dark:text-gray-300">No hay sorteos disponibles en este momento.</p>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-10">
      {/* 🏆 Título */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">🎉 Sorteos Disponibles</h1>
        <p className="text-gray-600 dark:text-gray-300">Compra tu ticket y gana grandes premios.</p>
      </header>

      {/* 🎟️ Tarjetas de Tickets */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {ticketTypes.map((ticket: any) => (
          <div
            key={ticket.id}
            className="relative overflow-hidden rounded-xl shadow-lg bg-white dark:bg-gray-900 border-2 border-yellow-400 p-4 text-left transform transition duration-300 hover:scale-105 hover:shadow-2xl"
          >
            {/* 🏆 Imagen del premio */}
            <div className="relative w-full h-40 rounded-lg overflow-hidden">
              {ticket.image_url ? (
                <Image
                  src={ticket.image_url}
                  alt={ticket.premio}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              ) : (
                <div className="w-full h-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
                  📷 No hay imagen
                </div>
              )}
            </div>

            {/* 🎟️ Info del Ticket */}
            <div className="relative mt-4">
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white uppercase tracking-wide">
                {ticket.name}
              </h2>

              <h4 className="text-3xl font-black text-yellow-600 dark:text-yellow-400 drop-shadow-md mt-1">
                🏆 {ticket.premio}
              </h4>

              <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mt-2">
                🎟️ Número: <span className="text-indigo-600 dark:text-indigo-400">#{ticket.min_number} - {ticket.max_number}</span>
              </h4>

              <p className="text-md font-medium text-gray-600 dark:text-gray-300 opacity-90 mt-1">
                📅 {ticket.date} | ⏰ {ticket.time.slice(0, 5)}
              </p>

              <h4 className="text-lg font-semibold text-green-600 dark:text-green-400 mt-2">
                💰 Precio: ₡{ticket.costo}
              </h4>

              {/* 🎟️ Botón de Comprar */}
              <a
                href={`/tickets/${ticket.id}`}
                className="mt-4 block w-full text-center text-lg font-bold text-white bg-indigo-600 px-5 py-3 rounded-lg shadow-md transition duration-200 hover:bg-indigo-500 hover:shadow-lg"
              >
                ¡Comprar Ticket Digital! 🎟️
              </a>
            </div>

            {/* 🎖️ Detalle Estético: Corte de Ticket */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-yellow-400 rounded-t-full"></div>
          </div>
        ))}
      </div>
    </main>
  );
}
