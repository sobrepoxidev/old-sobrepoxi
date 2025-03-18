// ----------------------------------------
// src/components/gallery/ClientComponents.tsx
// ----------------------------------------
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

// Swiper y módulos
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// ---------------------------------------------------------
// 1) Tipos e iconos
// ---------------------------------------------------------
export interface MediaItem {
  type: "image" | "video";
  url: string;
  caption?: string;
}

interface OpenGalleryModalEventDetail {
  item: MediaItem;
  productName?: string;
}

export function ExpandIcon() {
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
      <path d="M15 3h6v6" />
      <path d="M9 21H3v-6" />
      <path d="M21 3l-7 7" />
      <path d="M3 21l7-7" />
    </svg>
  );
}

export function CloseIcon() {
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
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// ---------------------------------------------------------
// 2) Botón de expandir (abre el modal)
// ---------------------------------------------------------
export function ExpandButton({
  mediaUrl,
  mediaType,
  caption,
  productName,
}: {
  mediaUrl: string;
  mediaType: "image" | "video";
  caption?: string;
  productName: string;
}) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    // Evento custom tipado
    const event = new CustomEvent<OpenGalleryModalEventDetail>(
      "openGalleryModal",
      {
        detail: {
          item: { type: mediaType, url: mediaUrl, caption },
          productName,
        },
      }
    );

    window.dispatchEvent(event);
  };

  return (
    <button
      className="absolute top-3 right-3 z-10 bg-black bg-opacity-60 hover:bg-opacity-80 text-white p-2 rounded-full transition-all duration-200 transform hover:scale-110"
      onClick={handleClick}
      aria-label="Ver en pantalla completa"
    >
      <ExpandIcon />
    </button>
  );
}

// ---------------------------------------------------------
// 3) Card individual para cada MediaItem (imagen o video)
// ---------------------------------------------------------
interface MediaItemCardProps {
  item: MediaItem;
  altText: string;
  productName: string;
}

function MediaItemCard({ item, altText, productName }: MediaItemCardProps) {
  return (
    <div className="relative w-full h-full">
      <ExpandButton
        mediaUrl={item.url}
        mediaType={item.type}
        caption={item.caption}
        productName={productName}
      />

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
          poster="/video-thumbnail.jpg"
        >
          <source src={item.url} type="video/mp4" />
          Tu navegador no soporta video HTML5.
        </video>
      )}

      {item.caption && (
        <div className="absolute bottom-3 left-3 right-3 bg-black bg-opacity-60 text-white text-sm px-4 py-2 rounded-md">
          {item.caption}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------
// 4) Carrusel con Swiper (Client Component)
// ---------------------------------------------------------
interface MediaCarouselProps {
  media: MediaItem[];
  productName: string;
}
export function MediaCarousel({ media, productName }: MediaCarouselProps) {
  return (
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
            <MediaItemCard
              item={item}
              altText={productName}
              productName={productName}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

// ---------------------------------------------------------
// 5) Modal de galería en pantalla completa
// ---------------------------------------------------------
function FullscreenModal({
  item,
  altText,
  onClose,
}: {
  item: MediaItem;
  altText: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    // Evita scroll en body mientras modal está abierto
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F2937] bg-opacity-90 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 z-10 bg-white dark:bg-gray-800 text-black dark:text-white p-2 rounded-full shadow-lg transition-transform duration-200 hover:scale-110"
          onClick={onClose}
          aria-label="Cerrar"
        >
          <CloseIcon />
        </button>

        <div className="w-full h-full flex flex-col">
          {item.type === "image" ? (
            <div
              className="relative w-full"
              style={{ height: "calc(90vh - 80px)" }}
            >
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
            <video className="max-h-[90vh] w-auto mx-auto" controls autoPlay>
              <source src={item.url} type="video/mp4" />
              Tu navegador no soporta video HTML5.
            </video>
          )}

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

// ---------------------------------------------------------
// 6) Modal global que escucha el evento 'openGalleryModal'
// ---------------------------------------------------------
export function GalleryModal() {
  const [modalContent, setModalContent] = useState<{
    isOpen: boolean;
    item?: MediaItem;
    productName?: string;
  }>({ isOpen: false });

  const closeModal = () => {
    setModalContent({ isOpen: false });
  };

  useEffect(() => {
    // Maneja el evento custom de abrir modal
    const handleOpenModal = (event: Event) => {
      const customEvent = event as CustomEvent<OpenGalleryModalEventDetail>;
      setModalContent({
        isOpen: true,
        item: customEvent.detail.item,
        productName: customEvent.detail.productName,
      });
    };

    window.addEventListener("openGalleryModal", handleOpenModal as EventListener);

    return () => {
      window.removeEventListener(
        "openGalleryModal",
        handleOpenModal as EventListener
      );
    };
  }, []);

  if (!modalContent.isOpen || !modalContent.item) {
    return null;
  }

  return (
    <FullscreenModal
      item={modalContent.item}
      altText={modalContent.productName ?? ""}
      onClose={closeModal}
    />
  );
}
