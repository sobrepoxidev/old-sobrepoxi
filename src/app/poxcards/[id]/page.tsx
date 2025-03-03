// app/poxcards/[id]/page.tsx (Server Component)
import { notFound } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import TicketDetailClient from "@/components/user/TicketDetailClient";

export default async function TicketTypeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  // Validar param
  if (!id) {
    return notFound();
  }

  // Crear cliente de Supabase para Server Components
  const supabase = createServerComponentClient({ cookies });

  // Fetch de datos
  const { data: ticketType, error } = await supabase
    .from("ticket_types")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !ticketType) {
    return notFound();
  }

  return (
    // Pasamos la info al Client Component
    <TicketDetailClient ticketType={ticketType} />
  );
}
