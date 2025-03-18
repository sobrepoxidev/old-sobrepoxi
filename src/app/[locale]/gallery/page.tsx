import { getTranslations } from "next-intl/server"; // Cambia la importación
import { supabase } from "@/lib/supabaseClient";
import { Suspense } from "react";
import Loading from "@/components/ui/LoadingGallery";
import { ProductCard } from "@/components/gallery/ProductCard";
// Solo importamos GalleryModal: un Client Component para el modal global
import { GalleryModal } from "@/components/gallery/ClientComponents";

const ServicesPage: React.FC = async () => {
  const t = await getTranslations("gallery"); // Usa getTranslations con await

  // Consulta a Supabase
  const { data: products, error } = await supabase
    .from("products")
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

  if (!products || products.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-10 text-center">
        <h1 className="text-3xl font-bold mb-4">Nuestros Productos</h1>
        <p>No hay productos disponibles en este momento.</p>
      </main>
    );
  }


  return (
    <div
      className="w-full min-h-screen bg-gradient-to-b from-sky-50 via-sky-100 to-stone-50
      dark:bg-gradient-to-b dark:from-[#2F3C51] dark:via-[#46586F] dark:to-[#2F3C51]
      transition-colors flex flex-col justify-start items-center py-14"
    >
      <section className="w-full max-w-7xl 2xl:max-w-screen-2xl flex flex-col items-center text-center py-1 px-1 md:py-5 sm:px-5 md:px-14 lg:px-5 relative">
        <h1 className="w-full text-xl sm:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight text-center">
          {t("title")}
        </h1>
        <p className="w-full text-sm sm:text-lg text-gray-600 dark:text-gray-300 mt-2">
          {t("subtitle")}
        </p>

        {/* Fallback mientras se cargan datos o client components */}
        <Suspense fallback={<Loading />}>
       
          <GalleryModal />

         
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-3">
            {products.map((product) => (
              <div key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </Suspense>
      </section>
    </div>
  );
}

export default ServicesPage;