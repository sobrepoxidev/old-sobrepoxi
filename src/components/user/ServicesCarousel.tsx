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
            className="bg-card-secondary rounded-lg overflow-hidden group "
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
            <div className="pt-1 pb-3 ">
              <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              <p className="text-text-secondary text-sm">
                {service.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Vista Mobile con Carrousel Mejorado */}
      <div className="md:hidden flex items-center justify-center h-full">
        <div className="relative w-full h-full flex flex-col justify-center">
          {/* Contenido del servicio activo */}
          <div className="w-full flex-grow flex flex-col justify-center">
            {services.map((service, index) => (
              <div 
                key={service.id} 
                className={`bg-card-secondary shadow-md p-1 overflow-hidden transition-all duration-300 transform ${
                  activeService === index ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute inset-0'
                }`}
                style={{
                  zIndex: activeService === index ? 10 : 0,
                  display: activeService === index ? 'block' : 'none'
                }}
              >
                <div className="overflow-hidden h-60 relative">
                  <Image
                    src={service.image}
                    alt={service.title}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>{/* agrega una pelicula obscura */}
                </div>
                <div className="py-1">
                  <h3 className="text-lg font-semibold text-primary">
                    {service.title}
                  </h3>
                  <p className="text-text-secondary text-sm">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Controles de navegación */}
          <div className="flex justify-between items-center px-6 py-2">
            <button 
              className="bg-black/30 hover:bg-black/50 p-3 rounded-full text-white shadow-md flex items-center justify-center"
              onClick={prevService}
              aria-label="Servicio anterior"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {/* Indicadores de posición */}
            <div className="flex justify-center gap-3">
              {services.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${activeService === index ? 'bg-primary' : 'bg-gray-light'}`}
                  onClick={() => setActiveService(index)}
                  aria-label={`Ver servicio ${index + 1}`}
                />
              ))}
            </div>
            
            <button 
              className="bg-black/30 hover:bg-black/50 p-3 rounded-full text-white shadow-md flex items-center justify-center"
              onClick={nextService}
              aria-label="Siguiente servicio"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
