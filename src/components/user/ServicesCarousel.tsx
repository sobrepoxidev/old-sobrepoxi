"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from "next-intl";

interface Service {
  id: number;
  title: string;
  description: string;
  image: string;
}


export default function ServicesCarousel() {
  const [activeService, setActiveService] = useState(0);
  const t = useTranslations('common');

  const services = JSON.parse(t.raw("servicesJson")) as Service[];

  // Controles de navegación
  const nextService = () => {
    setActiveService((prev) => (prev === services.length - 1 ? 0 : prev + 1));
  };

  const prevService = () => {
    setActiveService((prev) => (prev === 0 ? services.length - 1 : prev - 1));
  };

  return (
    <>
      {/* Vista Desktop y Tablet */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <div
            key={service.id}
            className="bg-card-secondary rounded-lg overflow-hidden shadow-md group hover:shadow-lg transition-all duration-300"
            onMouseEnter={() => setActiveService(index)}
          >
            <div className="overflow-hidden h-56 relative">
              <Image
                src={service.image}
                alt={service.title}
                width={400}
                height={300}
                className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="p-5">
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              <p className="text-text-secondary text-sm">
                {service.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Vista Mobile con Carrousel */}
      <div className="md:hidden">
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-300"
            style={{ transform: `translateX(-${activeService * 100}%)` }}
          >
            {services.map((service) => (
              <div key={service.id} className="w-full flex-shrink-0 px-1">
                <div className="bg-card-secondary rounded-lg overflow-hidden shadow-md">
                  <div className="overflow-hidden h-48 relative">
                    <Image
                      src={service.image}
                      alt={service.title}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">
                      {service.title}
                    </h3>
                    <p className="text-text-secondary text-sm">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Controles de navegación táctiles */}
          <button 
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 p-2 rounded-r-lg text-white"
            onClick={prevService}
            aria-label="Servicio anterior"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 p-2 rounded-l-lg text-white"
            onClick={nextService}
            aria-label="Siguiente servicio"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Indicadores de posición */}
          <div className="flex justify-center mt-4 gap-2">
            {services.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${activeService === index ? 'bg-primary' : 'bg-gray-light'}`}
                onClick={() => setActiveService(index)}
                aria-label={`Ver servicio ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
