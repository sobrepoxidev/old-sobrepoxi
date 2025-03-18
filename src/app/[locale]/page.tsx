// NOTA: No lleva "use client"
import Image from 'next/image';
import Link from 'next/link';
import WhatsAppButton from "@/components/user/WhatsAppButton";
import { useTranslations } from 'next-intl';

// Importamos componentes de cliente
import FloatingTicket from '@/components/user/FloatingTicket';
import ServicesCarousel from '@/components/user/ServicesCarousel';

// Datos que no cambian con frecuencia (pueden ir en un json o fetch estático)

interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
}

export default function HomePage() {
  const t = useTranslations('common');
  const projects = JSON.parse(t.raw("projectsJson")) as Project[];

  return (
    <div className="w-full min-h-screen bg-background text-foreground transition-colors">
      <FloatingTicket />

      {/* 🌟 Hero Section - OPTIMIZADO */}
      <section className="relative w-full min-h-screen">
        {/* Imagen de fondo */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/home_1_5.webp"
            alt="Muebles exclusivos"
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            quality={30}
            className="transition-transform duration-[10000ms] ease-in-out scale-105 animate-subtle-zoom"
            priority
          />
        </div>

        {/* Capa de gradiente + contenido */}
        <div className="absolute inset-0 bg-gradient-to-b 
                      from-white/15 via-white/20 to-white/5 
                      dark:from-black/35 dark:via-black/25 dark:to-black/15
                      flex flex-col justify-center items-center px-2">
          <div className="max-w-full sm:max-w-5xl md:max-w-6xl text-center" style={{ backdropFilter: "blur(1px)" }}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">

              {t("heroTitle")}

            </h1>
            <p className="text-base md:text-lg lg:text-xl mb-6 max-w-3xl mx-auto backdrop-blur-3xl">

              {t("heroSubtitle")}

            </p>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <Link href="/about-us" className="btn-primary px-2 text-base sm:px-6 sm:py-2 rounded-lg shadow-md hover:bg-blue-600 transition-all w-full sm:w-auto">

                {t("heroButton1")}

              </Link>
              <Link href="/contact-us" className="btn-secondary px-4 py-3 text-base sm:px-6 sm:py-2 rounded-lg shadow-md hover:bg-blue-600 transition-all w-full sm:w-auto">

                {t("heroButton2")}

              </Link>
            </div>
          </div>
        </div>

        {/* Flecha ajustada */}
        <div className="absolute bottom-24 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex justify-center">
          <svg className="w-10 h-10 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* 💼 Servicios Destacados */}
      <section className="relative max-w-full min-h-[calc(100vh-48px)] flex flex-col items-center overflow-x-hidden bg-gradient-to-b from-sky-50 via-sky-100 to-stone-50 dark:bg-gradient-to-b dark:from-[#2F3C51] dark:via-[#46586F] dark:to-[#2F3C51]">
        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col h-full">
          <div className="text-center justify-center py-2 sm:py-4 md:py-6">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">

              {t("servicesTitle")}


            </h2>
            <p className="text-base text-start md:text-lg text-text-secondary max-w-3xl">

              {t("servicesSubtitle")}

            </p>
          </div>
          <div className="flex items-center justify-center">{/* flex-grow */}
            <ServicesCarousel />
          </div>
          <p className="text-base sm:text-lg font-medium italic py-2">{t("weAreHere")}</p>
          <div className="mt-8 text-center">
            <div className="flex justify-center">
              <Link href="/gallery" className="px-6 py-3 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors duration-300 flex items-center">
                <span>

                  {t("ctaButton2")}

                </span>
                <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 🏆 Trabajos Destacados */}
      <section className="relative max-w-full min-h-[calc(100vh-48px)] flex flex-col items-center overflow-x-hidden bg-gradient-to-b from-stone-50 via-stone-100 to-sky-50
  dark:bg-gradient-to-b dark:from-[#2F3C51] dark:via-[#46586F] dark:to-[#2F3C51]">
        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col h-full">
          <div className="text-center justify-center py-2 sm:py-4 md:py-6">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
              {t("projectsTitle")}
            </h2>
            <p className="text-base text-start md:text-lg text-text-secondary max-w-3xl">
              {t("projectsSubtitle")}
            </p>
          </div>

          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
            {projects.map((project) => (
              <div
                key={project.id}
                className="group relative rounded-xl shadow-lg overflow-hidden h-64 sm:h-72"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 transition-opacity group-hover:opacity-90 pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="inline-block py-1 text-white bg-secondary text-xs font-semibold rounded-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {project.category}
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    {project.title}
                  </h3>

                  <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <Link
                      href="/gallery"
                      className="inline-flex items-center text-white hover:text-secondary transition-colors"
                    >
                      {t("projectsButton")}
                      <svg
                        className="w-4 h-4 ml-2"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M5 12H19M19 12L12 5M19 12L12 19"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-base sm:text-lg font-medium italic py-2 sm:py-4">{t("weAreHereSubtitle")}</p>
          <div className="mt-8 text-center">
            <div className="flex justify-center">
              <Link href="/gallery" className="px-6 py-3 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors duration-300 flex items-center">
                <span>

                  {t("ctaButton3")}

                </span>
                <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 📞 Llamado a la Acción Mejorado */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="/bg.webp"
            alt="Background pattern"
            fill
            style={{ objectFit: "cover" }}
          />
        </div>

        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="rounded-2xl py-2 pb-4 sm:p-10 ">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2 leading-tight">
                  {t("ctaTitle")}
                </h2>
                <p className="text-base md:text-lg text-text-secondary mb-2">
                  {t("ctaDescription")}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/contact"
                    className="btn-primary px-5 py-2.5 text-base md:text-lg inline-flex items-center"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      ></path>
                    </svg>
                    {t("ctaButton1")}
                  </Link>
                  <Link
                    href="/gallery"
                    className="btn-tertiary px-5 py-2.5 text-base md:text-lg"
                  >
                    {t("ctaButton2")}
                  </Link>
                </div>
              </div>

              <div className="hidden md:block relative">
                <div className="absolute -top-16 -right-16 w-32 h-32 bg-primary rounded-full opacity-20 animate-pulse" />
                <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-secondary rounded-full opacity-20 animate-pulse" />
                <div className="relative z-10 bg-card rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src="/contact.svg"
                    alt="Proceso de diseño"
                    width={500}
                    height={400}
                    className="rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🎟 Call to Action - Tickets Mejorado */}
      <section className="py-2 md:py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-8 items-center">
            <div className="md:col-span-3">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight ">
                {t("raffleTitle")}
              </h2>
              <p className="text-base md:text-lg mb-6 max-w-2xl ">
                {t("raffleText")}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/poxicards"
                  className="btn px-5 py-2.5 text-base md:text-lg text-primary hover:bg-gray-100 font-bold inline-flex items-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                    ></path>
                  </svg>
                  {t("raffleButton1")}
                </Link>
                <Link
                  href="/about-us"
                  className="hover:text-gray-700 underline px-5 py-2.5 text-base md:text-lg inline-flex items-center"
                >
                  {t("raffleButton2")}
                </Link>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="relative transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="absolute inset-0 bg-yellow-400 opacity-10 rounded-lg blur-xl" />
                <div className="relative backdrop-blur-sm bg-white/10 p-6 rounded-lg border border-yellow-600">
                  <div className="text-center">
                    <h3 className="text-xl md:text-2xl font-bold mb-4 ">
                      {t("ticketNumber")}
                    </h3>
                    <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-4 relative">
                      <div className="absolute inset-0 bg-primary rounded-full opacity-30 animate-ping" />
                      <Image
                        src="/logo.svg"
                        alt="Sobrepoxi"
                        width={200}
                        height={200}
                        className="w-15 h-15 pl-0 ml-0"
                      />
                    </div>
                    <p className="text-lg font-medium mb-2 ">
                      {t("ticketMonth")}
                    </p>
                    <div className="text-sm opacity-80 mb-4 ">
                      {t("ticketDescription")}
                    </div>
                    <div className="inline-block px-4 py-2 bg-secondary/80 rounded-lg text-black font-bold">
                      {t("ticketPrize")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 📱 Testimonios con Slider */}
      <section className="py-2 sm:py-4 md:py-6 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center sm:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              <span className="relative inline-block">
                {t("testimonialsTitle")}
                <span className="absolute bottom-0 left-0 w-full h-1 bg-secondary transform -translate-y-2"></span>
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Para este ejemplo, usamos nombres fijos; 
                si también quisieras traducir los nombres, 
                tomarías t("testimonialUser1"), t("testimonialUser2"), etc. */}
            {["Alejandra Carballo", "Jesús Brenes", "Glenn Gerr"].map(
              (testimonial) => (
                <div
                  key={testimonial}
                  className="card bg-card p-6 hover:shadow-xl transition-all duration-300 rounded-lg"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                      <span className="text-gray-600 font-bold text-lg">
                        {testimonial.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold">{testimonial}</h3>
                      <div className="flex text-warning">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-text-secondary italic">
                    &ldquo;{t("testimonialQuote")}&rdquo;
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Botón Flotante de WhatsApp */}
      <WhatsAppButton />
    </div>
  );
}