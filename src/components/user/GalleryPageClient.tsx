"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Improved icons using proper expand/collapse representation
function ExpandIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
      aria-hidden="true"
    >
      <path d="M15 3h6v6"></path>
      <path d="M9 21H3v-6"></path>
      <path d="M21 3l-7 7"></path>
      <path d="M3 21l7-7"></path>
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}

interface MediaItem {
  type: "image" | "video";
  url: string;
  caption?: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  media?: MediaItem[];
}

// WhatsApp integration
function getWhatsAppLink(productName: string) {
  const phoneNumber = "50685850000"; // Change to real number
  const text = encodeURIComponent(
    `¡Hola! Estoy interesado en obtener más información del producto: ${productName}`
  );
  return `https://wa.me/${phoneNumber}?text=${text}`;
}

interface Props {
  products: Product[];
}

export default function GalleryPageClient({ products }: Props) {
  // State for the global modal that will display media in fullscreen
  const [modalContent, setModalContent] = useState<{
    isOpen: boolean;
    item?: MediaItem;
    productName?: string;
  }>({
    isOpen: false,
  });

  // Close modal handler
  const closeModal = () => {
    setModalContent({ isOpen: false });
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-sky-50 via-sky-100 to-stone-50
  dark:bg-gradient-to-b dark:from-[#2F3C51] dark:via-[#46586F] dark:to-[#2F3C51] transition-colors flex flex-col justify-start items-center py-14">
    <section className="w-full max-w-7xl 2xl:max-w-screen-2xl flex flex-col items-center text-center py-1 px-1 md:py-5 sm:px-5 md:px-14 lg:px-5 relative ">
      <h1 className="w-full text-xl sm:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight text-center">Galería de proyectos</h1>

      {/* Responsive product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-2">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            openModal={(item) => setModalContent({ 
              isOpen: true, 
              item, 
              productName: product.name 
            })} 
          />
        ))}
      </div>

      {/* Global modal for fullscreen view */}
      {modalContent.isOpen && modalContent.item && (
        <FullscreenModal
          item={modalContent.item}
          altText={modalContent.productName || ""}
          onClose={closeModal}
        />
      )}
      </section>
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  openModal: (item: MediaItem) => void;
}

function ProductCard({ product, openModal }: ProductCardProps) {
  const { media = [], name, description } = product;
  
  return (
    <div className="dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full">
      {/* Media carousel with Swiper */}
      <div className="relative w-full bg-sky-400" style={{ aspectRatio: "4/3" }}>
        <Swiper 
          modules={[Navigation, Pagination]} 
          navigation 
          pagination={{ clickable: true }}
          className="h-full"
          loop={media.length > 1}
        >
          {media.map((item, index) => (
            <SwiperSlide key={index} className="flex items-center justify-center">
              <MediaItem 
                item={item} 
                altText={name} 
                onExpandClick={() => openModal(item)} 
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
  
      {/* Product info - usando flex-grow para que ocupe el espacio disponible */}
      <div className="p-4 flex flex-col flex-grow">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {name}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-0">
            {description}
          </p>
        </div>
        
        {/* Espaciador flexible que empuja el botón hacia abajo */}
        <div className="flex-grow"></div>
  
        {/* WhatsApp button - siempre al final */}
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
            <path d="M12,1C5.9,1,1,5.9,1,12c0,2.1,0.6,4.1,1.6,5.9L1,23l5.3-1.4c1.7,0.9,3.5,1.4,5.7,1.4c6.1,0,11-4.9,11-11S18.1,1,12,1z" fill="#25D366"/>
            <path d="M17.6 14.25c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.88-.78-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51-.17 0-.37-.01-.57-.01-.2 0-.52.07-.8.37-.27.3-1.03 1.01-1.03 2.48s1.06 2.88 1.21 3.07c.15.2 2.1 3.2 5.1 4.49.7.3 1.25.49 1.68.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.42.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35z" fill="white"/>
          </svg>
          Cotizar
        </a>
      </div>
    </div>
  );
}

interface MediaItemProps {
  item: MediaItem;
  altText: string;
  onExpandClick: () => void;
}

function MediaItem({ item, altText, onExpandClick }: MediaItemProps) {
  return (
    <div className="relative w-full h-full">
      {/* Expand button with improved icon */}
      <button
        className="absolute top-3 right-3 z-10 bg-black bg-opacity-60 hover:bg-opacity-80 text-white p-2 rounded-full transition-all duration-200 transform hover:scale-110"
        onClick={onExpandClick}
        aria-label="Ver en pantalla completa"
      >
        <ExpandIcon />
      </button>

      {/* Media content */}
      {item.type === "image" ? (
        <div className="relative w-full h-full">
          <Image
            src={item.url}
            alt={altText}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
            loading="lazy"
          />
        </div>
      ) : (
        <video
          className="w-full h-full object-cover"
          preload="none"
          controls
          poster="/video-thumbnail.jpg" // Optional: Add a placeholder image
        >
          <source src={item.url} type="video/mp4" />
          Tu navegador no soporta video HTML5.
        </video>
      )}

      {/* Caption with improved styling */}
      {item.caption && (
        <div className="absolute bottom-3 left-3 right-3 bg-black bg-opacity-60 text-white text-sm px-4 py-2 rounded-md">
          {item.caption}
        </div>
      )}
    </div>
  );
}

interface FullscreenModalProps {
  item: MediaItem;
  altText: string;
  onClose: () => void;
}

function FullscreenModal({ item, altText, onClose }: FullscreenModalProps) {
  // Close on escape key
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    window.addEventListener('keydown', handleEsc);
    // Prevent body scrolling while modal is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button with improved positioning and styling */}
        <button
          className="absolute top-4 right-4 z-10 bg-white dark:bg-gray-800 text-black dark:text-white p-2 rounded-full shadow-lg transition-transform duration-200 hover:scale-110"
          onClick={onClose}
          aria-label="Cerrar"
        >
          <CloseIcon />
        </button>

        {/* Full screen content */}
        <div className="w-full h-full flex flex-col">
          {item.type === "image" ? (
            <div className="relative w-full" style={{ height: "calc(90vh - 80px)" }}>
              <Image
                src={item.url}
                alt={altText}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>
          ) : (
            <video
              className="max-h-[90vh] w-auto mx-auto"
              controls
              autoPlay
            >
              <source src={item.url} type="video/mp4" />
              Tu navegador no soporta video HTML5.
            </video>
          )}

          {/* Caption with improved styling */}
          {item.caption && (
            <div className="mt-4 text-white text-center text-lg">
              {item.caption}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}