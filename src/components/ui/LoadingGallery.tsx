// app/(web)/gallery/loading.tsx 
import React from "react";

export default function Loading() {
  // Suponiendo que quieres mostrar 4 skeleton-cards
  return (
    
        <div className="w-full max-w-7xl 2xl:max-w-screen-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
    
  );
}

function SkeletonCard() {
    return (
      <div 
        className="dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full
        "
      >
        {/* Bloque que hace de imagen */}
        <div 
          className="relative w-full bg-gray-300 dark:bg-gray-700" 
          style={{ aspectRatio: '4/3' }} 
        >
            <div className="absolute inset-0 bg-white bg-opacity-50 animate-pulse"></div>
        </div>
  
        {/* Contenedor de texto e íconos */}
        <div className="p-4 flex flex-col flex-grow animate-pulse">
          {/* Títulos simulados */}
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2 w-3/4"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded mb-2 w-5/6"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded mb-2 w-2/3"></div>
  
          {/* Botón simulado */}
          <div className="mt-auto h-10 bg-blue-500/50 rounded w-full"></div>
        </div>
      </div>
    );
  }
  
