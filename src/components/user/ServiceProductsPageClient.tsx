"use client";
import React from "react";
import Image from "next/image";

// Tipado para el producto
interface Product {
  image_url: string;
  name: string;
  description: string;
}

interface Props {
  products: Product[];
}

export default function ServiceProductsPageClient({ products }: Props) {
  return (
    <section>
      <h1 className="text-3xl font-bold mb-8 text-center">Nuestros Productos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {products.map((product, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col"
          >
            {/* Contenedor de imagen con tamaño fijo pero adaptable */}
            <div className="relative w-full h-64"> {/* 🔹 Altura fija para mantener proporción */}
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-contain rounded-lg" // 🔹 Se ajusta dentro del contenedor sin recortar
              />
            </div>

            {/* Nombre */}
            <h2 className="text-xl font-semibold mt-4 text-gray-900 dark:text-white text-center">
              {product.name}
            </h2>

            {/* Descripción */}
            <p className="text-sm my-4 text-gray-600 dark:text-gray-300 text-center">
              {product.description}
            </p>

            {/* Botón o enlace (opcional) */}
            <button className="mt-auto btn-primary px-4 py-2 text-sm font-bold">
              Ver Detalles
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
