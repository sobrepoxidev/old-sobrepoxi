// ----------------------------------------
// src/components/gallery/ProductCard.tsx
// ----------------------------------------

// NOTA: No usamos 'use client' aquí. Esto se ejecuta en el servidor.

// Importamos SOLO el MediaCarousel (Client Component) para el carrusel de Swiper
import { MediaCarousel } from "./ClientComponents";

// Tipos de datos
export interface Product {
  id: number;
  name: string;
  description: string;
  // "media" viene desde la BD y lo usaremos en el carrusel
  media?: {
    type: "image" | "video";
    url: string;
    caption?: string;
  }[];
}

// WhatsApp integration
function getWhatsAppLink(productName: string) {
  // Cambia a tu número real
  const phoneNumber = "50685850000";
  const text = encodeURIComponent(
    `¡Hola! Estoy interesado en obtener más información del producto: ${productName}`
  );
  return `https://wa.me/${phoneNumber}?text=${text}`;
}

// Server Component que renderiza la tarjeta
export function ProductCard({ product }: { product: Product }) {
  const { media = [], name, description, id } = product;

  return (
    <div className="dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full">
      {/* Carrusel: delegamos a un Client Component */}
      <MediaCarousel media={media} productName={name} />

      {/* Product info */}
      <div className="p-4 flex flex-col flex-grow">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {name}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-0">
            {description}
          </p>
        </div>

        <div className="flex-grow"></div>

        {/* Botón de WhatsApp */}
        <a
          href={getWhatsAppLink(name)}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md font-medium flex items-center justify-center transition-colors duration-300"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              d="M12,1C5.9,1,1,5.9,1,12c0,2.1,0.6,4.1,1.6,5.9L1,23l5.3-1.4c1.7,0.9,3.5,1.4,5.7,1.4c6.1,0,11-4.9,11-11S18.1,1,12,1z"
              fill="#25D366"
            />
            <path
              d="M17.6 14.25c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.88-.78-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51-.17 0-.37-.01-.57-.01-.2 0-.52.07-.8.37-.27.3-1.03 1.01-1.03 2.48s1.06 2.88 1.21 3.07c.15.2 2.1 3.2 5.1 4.49.7.3 1.25.49 1.68.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.42.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35z"
              fill="white"
            />
          </svg>
          Cotizar
        </a>
      </div>
    </div>
  );
}
