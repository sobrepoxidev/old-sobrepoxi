"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function TicketsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full min-h-[calc(100vh-5rem)] bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors flex flex-col justify-center items-center">
      
      {/* 🎁 Sección Principal */}
      <section className="w-full max-w-5xl flex flex-col items-center text-center py-14 md:py-20 px-6 sm:px-10 md:px-14 lg:px-20 relative">
        
        <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
          ¡Participa y gana{" "}
          <span className="text-yellow-500">premios increíbles!</span> 🎁🔥
        </h1>

        <p className="max-w-3xl text-lg sm:text-xl text-gray-700 dark:text-gray-300 mt-4">
          Compra tu <strong>ticket digital</strong> y recibe automáticamente una entrada gratuita al sorteo.
          ¡Podrías ganar <span className="text-yellow-500 font-bold">productos exclusivos</span>!
        </p>

        {/* Botón Principal */}
        <Link
          href="/tickets/ver-tickets"
          className="mt-6 inline-block btn-primary text-lg px-6 py-3 rounded-lg shadow-lg transition transform hover:scale-105"
        >
          🎟️ Comprar Ticket Digital
        </Link>

        {/* Sutiles efectos visuales */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-32 h-32 bg-yellow-400 opacity-20 rounded-full blur-3xl top-8 left-16"></div>
          <div className="absolute w-32 h-32 bg-red-500 opacity-20 rounded-full blur-3xl bottom-8 right-16"></div>
        </div>

      </section>

      {/* 📝 Explicación Rápida */}
      <section className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 py-10 px-6 sm:px-12 lg:px-20">
        
        {/* Paso 1 */}
        <div className="card text-center p-5 rounded-xl shadow-lg transition transform hover:scale-105 hover:shadow-2xl bg-gray-100 dark:bg-gray-800">
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2">🛒 1. Compra tu Ticket</h3>
          <p className="text-gray-700 dark:text-gray-300 text-sm">
            Adquiere un <strong>ticket digital personalizable</strong> por solo ₡1000.
          </p>
        </div>

        {/* Paso 2 */}
        <div className="card text-center p-5 rounded-xl shadow-lg transition transform hover:scale-105 hover:shadow-2xl bg-gray-100 dark:bg-gray-800">
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2">🎟️ 2. Recibe tu Número</h3>
          <p className="text-gray-700 dark:text-gray-300 text-sm">
            Tras confirmar tu pago, podrás escoger <strong>un número</strong> para participar en el sorteo.
          </p>
        </div>

        {/* Paso 3 */}
        <div className="card text-center p-5 rounded-xl shadow-lg transition transform hover:scale-105 hover:shadow-2xl bg-gray-100 dark:bg-gray-800">
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2">🎁 3. ¡Gana Premios!</h3>
          <p className="text-gray-700 dark:text-gray-300 text-sm">
            Si tu número coincide con el de la lotería, ¡te llevas el premio!
          </p>
        </div>

      </section>

      {/* ⚠️ Aviso Legal */}
      <section className="w-full max-w-3xl mx-auto text-center py-8 px-6 sm:px-12 lg:px-20">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          La compra del ticket digital no implica la compra de una participación en el sorteo.
          Al adquirir el ticket, recibes automáticamente una entrada gratuita como cortesía.
        </p>
      </section>

      {/* 🎯 Llamado a la Acción Final */}
      <section className="w-full max-w-3xl mx-auto text-center py-12 px-6 sm:px-12 lg:px-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
          🎲 ¡No te quedes sin tu oportunidad!
        </h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 mt-2">
          Compra tu ticket digital ahora y entra gratis en el sorteo. ¡La suerte podría estar de tu lado!
        </p>

        <Link
          href="/tickets/ver-tickets"
          className="mt-5 inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg px-6 py-3 rounded-lg shadow-lg transition transform hover:scale-105"
        >
          🎟️ Comprar Ticket Digital
        </Link>
      </section>

    </div>
  );
}
