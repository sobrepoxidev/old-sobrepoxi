"use client";
import React from 'react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const AboutPage: React.FC = () => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
      setMounted(true)
    }, [])
  if (!mounted) return null;
  return (
    <div className="w-full min-h-screen bg-background text-foreground">
      {/* Hero / Portada */}
      <section className="relative w-full h-[60vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/about.webp"
          alt="Sobrepoxi - Diseño y Mobiliario"
          layout="fill"
          objectFit="cover"
          quality={100}
          className="opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4">
            Sobre Nosotros
          </h1>
          <p className="max-w-2xl text-white text-lg md:text-xl">
            Creamos muebles y espacios que cuentan historias.
          </p>
        </div>
      </section>

      {/* Nuestra Historia */}
      <section className="py-12 md:py-20 bg-card px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Nuestra Historia</h2>
          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            Sobrepoxi nació de un taller pequeño con un sueño enorme: demostrar que el diseño
            y la funcionalidad pueden fusionarse para crear piezas únicas. Desde el primer
            boceto hasta la última pincelada de acabado, cada detalle representa nuestra
            pasión y dedicación. Con el paso de los años, hemos evolucionado en técnicas,
            materiales y estilos, pero manteniendo siempre un ingrediente infaltable:
            la <strong>obsesión por la calidad</strong>.
          </p>
          <p className="text-base md:text-lg text-text-secondary leading-relaxed">
            Hoy, nuestro equipo multidisciplinario de diseñadores, artesanos y visionarios
            sigue ampliando fronteras. Creemos que cada mueble es un lienzo donde plasmamos
            tendencias y espíritu innovador, sin perder ese toque personal que convierte un
            objeto en un compañero de historias cotidianas.
          </p>
        </div>
      </section>

      {/* Misión / Visión / Valores */}
      <section className="py-12 md:py-20 bg-background px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-2xl font-bold mb-4">Misión</h3>
            <p className="text-base text-text-secondary leading-relaxed">
              Diseñar y elaborar piezas únicas que transformen espacios en lugares
              llenos de vida, donde la estética y la practicidad se unan para mejorar
              la experiencia de cada persona que las habita.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4">Visión</h3>
            <p className="text-base text-text-secondary leading-relaxed">
              Convertirnos en referente de innovación y excelencia en el mundo del mobiliario,
              promoviendo soluciones que dialoguen con el futuro, sin sacrificar la
              calidez de lo hecho a mano.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4">Valores</h3>
            <ul className="list-disc list-inside space-y-2 text-text-secondary">
              <li><strong>Creatividad:</strong> exploramos nuevas ideas y tendencias constantemente.</li>
              <li><strong>Calidad:</strong> nos gusta ser tercos con la perfección.</li>
              <li><strong>Sostenibilidad:</strong> seleccionamos materiales y procesos eco-amigables.</li>
              <li><strong>Pasión:</strong> ponemos el corazón en cada proyecto, grande o pequeño.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Filosofía de Trabajo */}
      <section className="py-12 md:py-20 bg-card px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Nuestra Filosofía</h2>
          <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-6">
            En Sobrepoxi nos mueve la idea de que cada espacio tiene un alma propia. Nuestra
            labor consiste en escuchar esa esencia y darle forma a través de soluciones
            originales que no solo impresionen a primera vista, sino que conserven su
            encanto con el paso del tiempo.   
          </p>
          <p className="text-base md:text-lg text-text-secondary leading-relaxed">
            Creemos en una relación cercana con nuestros clientes: <em>más que muebles,
            creamos complicidades.</em> Nos encanta explorar tendencias y fusionarlas con
            materiales de alta calidad, siempre en sintonía con la sostenibilidad. A fin de
            cuentas, ¿de qué sirve un mueble hermoso si el planeta paga la factura?
          </p>
        </div>
      </section>

      {/* Llamado a explorar más (sin invadir Contact/Services) */}
      <section className="py-12 md:py-20 bg-background px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Listo para conocer más?
          </h2>
          <p className="text-base md:text-lg text-text-secondary mb-6">
            Si querés ver de cerca cómo convertimos nuestras ideas en realidades tangibles,
            no dudes en navegar por nuestras secciones de proyectos y galería. ¡Te prometemos
            inspiración y muchas ganas de renovar tu espacio!
          </p>
          {/* Un botón o link que redireccione a la galería o proyectos */}
          {/* Evitamos colocar aquí la información de contacto o lista de servicios
              para no duplicar lo de otras secciones */}
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
