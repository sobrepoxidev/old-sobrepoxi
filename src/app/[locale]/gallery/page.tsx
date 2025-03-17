// src/app/services/page.tsx

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import GalleryPageClient from '@/components/user/GalleryPageClient';

export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
  // Crear cliente de Supabase
  const supabase = createServerComponentClient({ cookies });

  // Hacemos la consulta
  const { data: products, error } = await supabase
    .from('products')
    .select(`
      id,
      main_image_url,
      image_urls,
      album_title,
      image_caption,
      name,
      media,
      description
    `);

  if (error) {
    console.error("Error obteniendo productos:", error.message);
    return (
      <main className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-10 text-red-500">
        Error al cargar: {error.message}
      </main>
    );
  }

  console.log("Productos: ", products);

  if (!products || products.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-10 text-center">
        <h1 className="text-3xl font-bold mb-4">Nuestros Productos</h1>
        <p>No hay productos disponibles en este momento.</p>
      </main>
    );
  }

  // Renderizar el Client Component con los datos
  return (
  
 
      <GalleryPageClient products={products} />
   
    
  );
}
