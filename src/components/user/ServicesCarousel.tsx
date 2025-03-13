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

interface Props {
  
}

export default function ServicesCarousel({  }: Props) {
  const [activeService, setActiveService] = useState(0);
  const t = useTranslations('common');

  const services = JSON.parse(t.raw("servicesJson")) as Service[];


  return (
    <>
      {/* Vista Desktop y Tablet */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <div
            key={service.id}
            className="card text-center group hover:-translate-y-2 transition-all duration-300"
            onMouseEnter={() => setActiveService(index)}
          >
            <div className="overflow-hidden rounded-lg mb-6 relative">
              <Image
                src={service.image}
                alt={service.title}
                width={400}
                height={300}
                className="rounded-lg transform transition-transform duration-500 group-hover:scale-110"
                
              />
              {/* <div className="absolute inset-0 bg-primary bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                <span className="btn-secondary px-4 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Ver detalles
                </span>
              </div> */}
            </div>
            <h3 className="text-2xl font-semibold mb-3 group-hover:text-primary transition-colors">
              {service.title}
            </h3>
            <p className="text-text-secondary">
              {service.description}
            </p>
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
              <div key={service.id} className="w-full flex-shrink-0 px-4">
                <div className="card text-center">
                  <div className="overflow-hidden rounded-lg mb-6">
                    <Image
                      src={service.image}
                      alt={service.title}
                      width={400}
                      height={300}
                      className="rounded-lg"
                    />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">
                    {service.title}
                  </h3>
                  <p className="text-text-secondary">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Controles de Carrousel */}
          <div className="flex justify-center mt-6 gap-2">
            {services.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full ${activeService === index ? 'bg-primary' : 'bg-gray-light'}`}
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
