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
    <div className="w-full min-h-screen bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors flex flex-col justify-center items-center py-14">

      {/* 🎁 Sección Principal */}
      <section className="w-full max-w-6xl flex flex-col items-center text-center py-1 px-1 md:py-5 sm:px-5 md:px-14 lg:px-5 relative">

        <h1 className="w-full text-xl sm:text-6xl px-0 mx-0 font-extrabold text-gray-900 dark:text-white leading-tight text-center">
          ¡Adquiere tu PoxiCard, participa por{" "}
          <span className="text-blue-500">premios increíbles!</span> 🎁🔥
        </h1>

        <p className="max-w-3xl text-sm mt-2 sm:text-xl text-gray-700 dark:text-gray-300 ">
          Compra tu <strong>PoxiCard</strong> y participa de cortesía en un sorteo.
          ¡Podrías ganar <span className="text-blue-400 font-bold">productos increíbles</span>!
        </p>

        {/* Botón Principal */}
        <Link
          href="/poxicards/ver-poxicards"
          className="mt-3 mb-3 inline-block btn-primary text-sm sm:text-lg px-6 py-3 rounded-lg shadow-lg transition transform hover:scale-105"
        >
          Comprar PoxiCard
        </Link>

        {/* Sutiles efectos visuales */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-32 h-32 bg-yellow-400 opacity-20 rounded-full blur-3xl top-8 left-16"></div>
          <div className="absolute w-32 h-32 bg-red-500 opacity-20 rounded-full blur-3xl bottom-8 right-16"></div>
        </div>

      </section>

      {/* 📝 Explicación Rápida */}
      <section className="w-full max-w-6xl grid mt-0 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-5 sm:px-5 lg:px-5">

        {/* Paso 1 */}
        <div className="card text-center p-0 rounded-xl shadow-lg transition transform hover:scale-105 hover:shadow-2xl bg-gray-100 dark:bg-gray-800">
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2">1. Compra tus PoxiCards 🛒</h3>
          <p className="text-gray-700 dark:text-gray-300 text-sm">
            Adquiere un <strong>PoxiCard digital</strong> por solo ₡1000.
          </p>
        </div>

        {/* Paso 2 */}
        <div className="card text-center rounded-xl shadow-lg transition transform hover:scale-105 hover:shadow-2xl bg-gray-100 dark:bg-gray-800">
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2">2. Recibe tu Número 🎟️</h3>
          <p className="text-gray-700 dark:text-gray-300 text-sm">
            Tras realizar tu pago, podrás escoger <strong>un número</strong> para participar en un sorteo.
          </p>
        </div>


        {/* Paso 3 */}
        <div className="card text-center rounded-xl shadow-lg transition transform hover:scale-105 hover:shadow-2xl bg-gray-100 dark:bg-gray-800">
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2">3. Personaliza y descarga tu PoxiCard 🎨</h3>
          <p className="text-gray-700 dark:text-gray-300 text-sm">
            Puedes personalizar tu PoxiCard con tu número y descargarla para compartir en redes sociales.
          </p>
        </div>

        {/* Paso 3 */}
        <div className="card text-center rounded-xl shadow-lg transition transform hover:scale-105 hover:shadow-2xl bg-gray-100 dark:bg-gray-800">
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2">4. ¡Gana Premios! 🎁</h3>
          <p className="text-gray-700 dark:text-gray-300 text-sm">
            Si tu número coincide con el de la lotería, ¡te llevas el premio!
          </p>
        </div>

      </section>

      {/* ⚠️ Aviso Legal */}
      <section className="w-full max-w-3xl mx-auto text-center py-8 px-6 sm:px-12 lg:px-5">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          La compra del PoxiCard digital no implica la compra de una participación en el sorteo.
          Al adquirir el PoxiCard, recibes automáticamente una entrada gratuita como cortesía.
        </p>
      </section>



    </div>
  );
}
