// src/app/services/page.tsx

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import ServiceProductsPageClient from '@/components/user/ServiceProductsPageClient';

// Forzamos render dinámico para que siempre haga la consulta actualizada
export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
  // Crear cliente de Supabase sin cookies (porque la ruta es pública)
  const supabase = createServerComponentClient({ cookies });

  // Hacemos la consulta a la tabla 'products' de Supabase
  const { data: products, error } = await supabase.from('products').select('*');

  if (error) {
    console.error("Error obteniendo productos:", error.message);
    return (
      <main className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-10 text-red-500">
        Error al cargar: {error.message}
      </main>
    );
  }

  console.log("Productos obtenidos:", products); // Para depuración

  // Si no hay productos, mostramos un mensaje amigable
  if (!products || products.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-10 text-center">
        <h1 className="text-3xl font-bold mb-4">Nuestros Productos</h1>
        <p>No hay productos disponibles en este momento.</p>
      </main>
    );
  }

  // Renderizar el Client Component con los datos obtenidos
  return (
    <main className="max-w-7xl mx-auto px-4 md:px-12 lg:px-0 py-14">
      <ServiceProductsPageClient products={products} />
    </main>
  );
}
