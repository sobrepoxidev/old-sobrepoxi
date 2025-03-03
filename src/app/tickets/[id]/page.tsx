import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import TicketPayment from "@/components/user/TicketPayment";
import Image from "next/image";

type Props = {
  params: { id: string };
};

export default async function TicketTypeDetailPage({ params }: Props) {
  const { id } = params;

  if (!id) {
    console.error("Error: ID no está definido correctamente");
    return notFound();
  }

  const { data: ticketType, error } = await supabase
    .from("ticket_types")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !ticketType) {
    console.error("Error obteniendo ticket:", error);
    return notFound();
  }

  return (
    <main className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 py-10">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-6">
        🎟️ Confirmar Compra de Ticket
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 🎟️ Vista del Ticket */}
        <div className="relative overflow-hidden rounded-xl shadow-lg bg-white dark:bg-gray-900 p-4 text-left">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-4">
            Tu Ticket Digital
          </h2>
        <div className="relative overflow-hidden rounded-xl shadow-lg bg-white dark:bg-gray-900 border-2 border-yellow-400 p-4 text-left transform transition duration-300 hover:scale-105 hover:shadow-2x">
          

          {/* 🏆 Imagen del Ticket */}
          <div className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden">
            {ticketType.image_url ? (
              <Image
                src={ticketType.image_url}
                alt={`Ticket de ${ticketType.name}`}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
                📷 Ticket en proceso...
              </div>
            )}
          </div>

          {/* 🎟️ Info del Ticket */}
          <div className="relative mt-4">
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white uppercase tracking-wide">
                {ticketType.name}
              </h2>

              <h4 className="text-3xl font-black text-yellow-600 dark:text-yellow-400 drop-shadow-md mt-1">
                🏆 {ticketType.premio}
              </h4>

              <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mt-2">
                🎟️ Número: <span className="text-indigo-600 dark:text-indigo-400">#{ticketType.min_number} - {ticketType.max_number}</span>
              </h4>

              <p className="text-md font-medium text-gray-600 dark:text-gray-300 opacity-90 mt-1">
                📅 {ticketType.date} | ⏰ {ticketType.time.slice(0, 5)}
              </p>

              <h4 className="text-lg font-semibold text-green-600 dark:text-green-400 mt-2">
                💰 Precio: ₡{ticketType.costo}
              </h4>

             
            </div>

            {/* 🎖️ Detalle Estético: Corte de Ticket */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-yellow-400 rounded-t-full"></div>
        </div>
        </div>

        {/* 📲 Pago del Ticket */}
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md">
          
          <TicketPayment />
        </div>
      </div>
    </main>
  );
}
