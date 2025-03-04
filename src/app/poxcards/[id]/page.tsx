// app/poxcards/[id]/page.tsx (Server Component)
import { notFound } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import TicketDetailClient from "@/components/user/TicketDetailClient";
import { Suspense } from "react";



export default async function TicketDetailPage({
  params,
  _searchParams
}: {
  params: { id: string };
  _searchParams?: { [key: string]: string | string[] | undefined };
}) {
  _searchParams;
  const { id } = params;
  console.log('id del server component : ', id);

  // Validar param
  if (!id) {
    return notFound();
  }

  // Crear cliente de Supabase para Server Components
  const supabase = createServerComponentClient({ cookies: () =>  cookies() });

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
    <Suspense fallback={<div>Cargando detalles del ticket...</div>}>
      <TicketDetailClient ticketType={ticketType} />
    </Suspense>
  );
}