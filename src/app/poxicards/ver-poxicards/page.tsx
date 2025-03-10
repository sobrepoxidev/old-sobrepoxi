// src/app/tickets/page.tsx

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
export const dynamic = 'force-dynamic';
import TicketTypesPageClient from '@/components/user/TicketTypesPageClient'; // <-- Importamos el comp. cliente

export default async function TicketTypesPage() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data: ticketTypes, error } = await supabase.from('ticket_types').select('*');
  console.log('ticketTypes: ', ticketTypes);


  if (error) {
    return (
      <main className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-10 text-red-500">
        Error al cargar: {error.message}
      </main>
    );
  }

  if (!ticketTypes || ticketTypes.length === 0) {



    return (
      <main className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">PoxiCards Actuales</h1>
        <p className="text-gray-700 dark:text-gray-300">No hay PoxiCards disponibles en este momento.</p>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-12 lg:px-0 py-0">
       <TicketTypesPageClient
        ticketTypes={ticketTypes}
      />
    </main>
  );
}
