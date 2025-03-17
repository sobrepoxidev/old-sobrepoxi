import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function TicketsPage() {
  const t = useTranslations("ticketsPage");


  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-sky-50 via-sky-100 to-stone-50
  dark:bg-gradient-to-b dark:from-[#2F3C51] dark:via-[#46586F] dark:to-[#2F3C51] transition-colors flex flex-col justify-start items-center py-14">
      {/* 🎁 Sección Principal */}
      <section className="w-full max-w-6xl flex flex-col items-center text-center py-1 px-1 md:py-5 sm:px-5 md:px-14 lg:px-5 relative ">
        {/* Título principal */}
        <h1 className="w-full text-xl sm:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight text-center">
          {t.rich("mainTitle", {
            // Reemplazamos <span> por un span con clase
            span: (chunks) => <span className="text-blue-500">{chunks}</span>,
          })}
        </h1>

        {/* Subtítulo */}
        <p className="max-w-3xl text-sm mt-2 sm:text-xl text-gray-700 dark:text-gray-300">
          {t.rich("mainSubtitle", {
            strong: (chunks) => <strong>{chunks}</strong>,
            highlight: (chunks) => (
              <span className="text-blue-400 font-bold">{chunks}</span>
            ),
          })}
        </p>

        {/* Botón Principal */}
        <Link
          href="/poxicards/ver-poxicards"
          className="mt-3 mb-3 inline-block btn-primary text-sm sm:text-lg px-6 py-3 rounded-lg shadow-lg transition transform hover:scale-105"
        >
          {t("btnBuy")}
        </Link>

        {/* Efectos visuales */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-32 h-32 bg-yellow-400 opacity-20 rounded-full blur-3xl top-8 left-16"></div>
          <div className="absolute w-32 h-32 bg-red-500 opacity-20 rounded-full blur-3xl bottom-8 right-16"></div>
        </div>
      </section>

      {/* 📝 Explicación Rápida */}
      <section className="w-full max-w-6xl grid mt-0 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-5 sm:px-5 lg:px-5">
        {/* Paso 1 */}
        <div className="card text-center p-0 rounded-xl shadow-lg transition transform hover:scale-105 hover:shadow-2xl bg-gray-100 dark:bg-gray-800">
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2">
            {t("step1Title")}
          </h3>
          <p className="text-gray-700 dark:text-gray-300 text-sm px-4 py-2">
            {t.rich("step1Desc", {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </p>
        </div>

        {/* Paso 2 */}
        <div className="card text-center rounded-xl shadow-lg transition transform hover:scale-105 hover:shadow-2xl bg-gray-100 dark:bg-gray-800">
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2">
            {t("step2Title")}
          </h3>
          <p className="text-gray-700 dark:text-gray-300 text-sm px-4 py-2">
            {t.rich("step2Desc", {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </p>
        </div>

        {/* Paso 3 */}
        <div className="card text-center rounded-xl shadow-lg transition transform hover:scale-105 hover:shadow-2xl bg-gray-100 dark:bg-gray-800">
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2">
            {t("step3Title")}
          </h3>
          <p className="text-gray-700 dark:text-gray-300 text-sm px-4 py-2">
            {t("step3Desc")}
          </p>
        </div>

        {/* Paso 4 */}
        <div className="card text-center rounded-xl shadow-lg transition transform hover:scale-105 hover:shadow-2xl bg-gray-100 dark:bg-gray-800">
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2">
            {t("step4Title")}
          </h3>
          <p className="text-gray-700 dark:text-gray-300 text-sm px-4 py-2">
            {t("step4Desc")}
          </p>
        </div>
      </section>

      {/* ⚠️ Aviso Legal */}
      <section className="w-full max-w-3xl mx-auto text-center py-8 px-6 sm:px-12 lg:px-5">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t("legalWarning")}
        </p>
      </section>
    </div>
  );
}
