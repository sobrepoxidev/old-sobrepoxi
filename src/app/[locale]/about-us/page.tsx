"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

const AboutPage: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("aboutPage");

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  return (
    <div className="w-full min-h-screen bg-background text-foreground">
      {/* Hero / Portada */}
      <section className="relative w-full h-[60vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/about.webp"
          alt="Sobrepoxi - Diseño y Mobiliario"
          fill
          style={{ objectFit: "cover" }}
          quality={10}
          className="opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-white/20 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4">
            {t("heroTitle")}
          </h1>
          <p className="max-w-2xl text-lg md:text-xl">
            {t("heroSubtitle")}
          </p>
        </div>
      </section>

      {/* Nuestra Historia */}
      <section className="py-12 md:py-20 bg-card px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            {t("historyTitle")}
          </h2>
          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            {t.rich("historyParagraph1", {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </p>
          <p className="text-base md:text-lg text-text-secondary leading-relaxed">
            {/* No hay etiquetas <strong> o <em> en historyParagraph2, 
                pero podemos usar t.rich de todas formas sin definiciones extra */}
            {t.rich("historyParagraph2")}
          </p>
        </div>
      </section>

      {/* Misión / Visión / Valores */}
      <section className="py-12 md:py-20 bg-background px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-3">
          {/* Misión */}
          <div>
            <h3 className="text-2xl font-bold mb-4">{t("missionTitle")}</h3>
            <p className="text-base text-text-secondary leading-relaxed">
              {t("missionText")}
            </p>
          </div>
          {/* Visión */}
          <div>
            <h3 className="text-2xl font-bold mb-4">{t("visionTitle")}</h3>
            <p className="text-base text-text-secondary leading-relaxed">
              {t("visionText")}
            </p>
          </div>
          {/* Valores */}
          <div>
            <h3 className="text-2xl font-bold mb-4">{t("valuesTitle")}</h3>
            <ul className="list-disc list-inside space-y-2 text-text-secondary">
              <li>
                {t.rich("valuesList.creativity", {
                  strong: (chunks) => <strong>{chunks}</strong>,
                })}
              </li>
              <li>
                {t.rich("valuesList.quality", {
                  strong: (chunks) => <strong>{chunks}</strong>,
                })}
              </li>
              <li>
                {t.rich("valuesList.sustainability", {
                  strong: (chunks) => <strong>{chunks}</strong>,
                })}
              </li>
              <li>
                {t.rich("valuesList.passion", {
                  strong: (chunks) => <strong>{chunks}</strong>,
                })}
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Filosofía de Trabajo */}
      <section className="py-12 md:py-20 bg-card px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            {t("philosophyTitle")}
          </h2>
          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            {t.rich("philosophyParagraph1")}
          </p>
          <p className="text-base md:text-lg text-text-secondary leading-relaxed">
            {t.rich("philosophyParagraph2", {
              em: (chunks) => <em>{chunks}</em>,
            })}
          </p>
        </div>
      </section>

      {/* Llamado a explorar más */}
      <section className="py-12 md:py-20 bg-background px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("readyTitle")}
          </h2>
          <p className="text-base md:text-lg text-text-secondary mb-6">
            {t("readyParagraph")}
          </p>
          {/* Aquí podrías colocar un botón o link a la galería/proyectos */}
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
