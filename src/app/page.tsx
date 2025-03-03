import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import FloatingTicket from '@/components/user/FloatingTicket';


const HomePage: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-background text-foreground transition-colors">
       <FloatingTicket />


      {/* 🌟 Hero Section */}
      <section className="relative w-full h-screen">
        <Image
          src="/home_1.webp"
          alt="Muebles exclusivos"
          layout="fill"
          objectFit="cover"
          quality={100}
          className="opacity-80"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center px-6">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4">
            Diseño & Mobiliario Exclusivo para Espacios Únicos
          </h1>
          <p className="text-lg md:text-2xl text-gray-200 mb-8 max-w-3xl">
            Creamos soluciones personalizadas para transformar cada rincón de tu hogar o empresa con elegancia y funcionalidad.
          </p>
          <Link href="/about" className="btn-primary px-6 py-3 text-lg">
            Conócenos Más
          </Link>
        </div>
      </section>

      {/* 💼 Servicios Destacados */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">
            Nuestros Servicios
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* 🔨 Servicio 1 - Muebles Personalizados */}
            <div className="card text-center">
              <Image
                src="/home_2.webp"
                alt="Muebles Personalizados"
                width={400}
                height={300}
                className="rounded-md mb-4"
              />
              <h3 className="text-2xl font-semibold mb-2">Muebles Personalizados</h3>
              <p className="text-text-secondary">
                Diseñamos y fabricamos piezas únicas para tu hogar o negocio.
              </p>
            </div>

            {/* 🎨 Servicio 2 - Diseño de Interiores */}
            <div className="card text-center">
              <Image
                src="/home_3.webp"
                alt="Diseño de Interiores"
                width={400}
                height={300}
                className="rounded-md mb-4"
              />
              <h3 className="text-2xl font-semibold mb-2">Diseño de Interiores</h3>
              <p className="text-text-secondary">
                Creamos ambientes exclusivos adaptados a tus necesidades.
              </p>
            </div>

            {/* 🛠 Servicio 3 - Restauración y Remodelación */}
            <div className="card text-center">
              <Image
                src="/home_4.webp"
                alt="Restauración y Remodelación"
                width={400}
                height={300}
                className="rounded-md mb-4"
              />
              <h3 className="text-2xl font-semibold mb-2">Restauración y Remodelación</h3>
              <p className="text-text-secondary">
                Damos nueva vida a tus muebles y espacios con acabados de calidad.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 🏆 Trabajos Destacados */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">
            Proyectos Recientes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <div className="relative group">
              <Image
                src="/home_5.webp"
                alt="Residencia Moderna"
                width={400}
                height={300}
                className="rounded-md transition-transform transform group-hover:scale-105"
              />
              <h3 className="absolute inset-0 flex items-end text-white text-xl font-semibold bg-black bg-opacity-50 p-4">
                Residencia Moderna
              </h3>
            </div>

            <div className="relative group">
              <Image
                src="/home_6.webp"
                alt="Oficina Ejecutiva"
                width={400}
                height={300}
                className="rounded-md transition-transform transform group-hover:scale-105"
              />
              <h3 className="absolute inset-0 flex items-end text-white text-xl font-semibold bg-black bg-opacity-50 p-4">
                Oficina Ejecutiva
              </h3>
            </div>

            <div className="relative group">
              <Image
                src="/home_7.webp"
                alt="Espacio Comercial"
                width={400}
                height={300}
                className="rounded-md transition-transform transform group-hover:scale-105"
              />
              <h3 className="absolute inset-0 flex items-end text-white text-xl font-semibold bg-black bg-opacity-50 p-4">
                Espacio Comercial
              </h3>
            </div>

          </div>
        </div>
      </section>

      {/* 📞 Llamado a la Acción */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            ¿Listo para transformar tus espacios?
          </h2>
          <p className="text-lg text-text-secondary mb-8">
            Contáctanos para iniciar tu proyecto con los mejores expertos en diseño y mobiliario.
          </p>
          <Link href="/contact" className="btn-primary px-8 py-4 text-lg">
            Contáctanos
          </Link>
        </div>
      </section>
      {/* 🎟 Call to Action - Tickets */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">🎟 ¡Compra tu ticket y participa en el sorteo sorteo mobiliario!</h2>
          <p className="text-lg text-text-secondary mb-8">
            Solo por ₡1000 obtienes un boleto personalizado y participas en nuestro sorteo especial.
          </p>
          <Link href="/tickets" className="btn-primary px-8 py-4 text-lg">
            Comprar Ticket
          </Link>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
