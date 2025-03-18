import { createServerActionClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Database } from '@/types-db';

type UserTicketT = Database['user_tickets'];

// Forzamos el rendering dinámico porque usamos Server Actions.
export const dynamic = 'force-dynamic';

const bancos = [
    "Banco Nacional de Costa Rica (BNCR)",
    "Banco de Costa Rica (BCR)",
    "BAC Credomatic",
    "Banco Popular",
    "Davivienda",
    "Scotiabank",
    "Banco Promerica",
    "Banco Lafise",
];

// Server Action que actualiza `payment_reference`
async function updatePaymentReference(formData: FormData) {
    "use server";

    // Obtenemos los datos enviados desde el formulario.
    const orderId = formData.get("orderId") as string;
    const digits = formData.get("digits") as string;
    const bankName = formData.get("bankName") as string;

    // Inicializamos el cliente de Supabase (para Server Actions se usa `createServerActionClient`)
    const supabase = createServerActionClient({ cookies });

    // Buscamos la orden en la BD.
    const { data: order, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

    if (error || !order) {
        throw new Error("No se encontró la orden o hubo un error.");
    }

    // Validamos que sea sinpe.
    if (order.payment_method !== 'sinpe') {
        throw new Error("No se puede editar este pago, no es 'sinpe'.");
    }

    // Validamos que no hayan pasado más de 24 horas.
    const createdAt = new Date(order.created_at);
    const now = new Date();
    const diffMs = now.getTime() - createdAt.getTime();
    const hours = diffMs / (1000 * 60 * 60);

    if (hours > 24) {
        throw new Error("Han pasado más de 24 horas, no puedes modificar la referencia de pago.");
    }

    // Armamos la cadena nueva del pago.
    const newReference = `4 ultimos digitos: ${digits} - Banco: ${bankName}`;

    // Actualizamos en la tabla `orders`.
    const { error: updateError } = await supabase
        .from("orders")
        .update({ payment_reference: newReference })
        .eq("id", orderId);

    if (updateError) {
        throw new Error(updateError.message);
    }

    // Al terminar, redirigimos de nuevo a esta página (forzando refresco).
    redirect(`/es/poxicards/orders/${orderId}/edit`);
}

// Page Server Component
type tParams = Promise<{ orderId: string }>;
export default async function OrdersEditPage(props: { params: tParams }) {
    const { orderId } = await props.params;

    // Iniciamos el cliente para Server Components y obtenemos la sesión
    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });
    const {
        data: { session },
    } = await supabase.auth.getSession();

    // Si no hay sesión, redirigimos a login
    if (!session) {
        redirect('/login');
    }

    // Cargamos la orden
    const { data: order, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

    if (error) {
        return (
            <main className="max-w-2xl mx-auto p-4 text-red-500">
                Error al cargar: {error.message}
            </main>
        );
    }

    if (!order) {
        return (
            <main className="max-w-2xl mx-auto p-4 text-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Orden no disponible</h1>
                <p className="text-gray-700 dark:text-gray-300">
                    No existe esta orden o no tienes acceso.
                </p>
            </main>
        );
    }

    // Cargamos los items asociados (p. ej. user_tickets)
    const { data: items, error: itemsError } = await supabase
        .from('user_tickets')
        .select('*')
        .eq('order_id', order.id);

    // Parseamos dígitos/banco si existe un payment_reference
    let digits = "";
    let bankName = "";

    if (order.payment_reference) {
        const match = order.payment_reference.match(/4 ultimos digitos: (\d{4}) - Banco: (.+)/);
        if (match) {
            digits = match[1];
            bankName = match[2];
        }
    }

    // Validamos si el usuario puede editar:
    const createdAt = new Date(order.created_at);
    const now = new Date();
    const diffMs = now.getTime() - createdAt.getTime();
    const hours = diffMs / (1000 * 60 * 60);
    const canEdit = order.payment_method === "sinpe" && hours <= 24;

    // Info del usuario (opcional)
    const correo = session.user?.email;
    const nombreUsuario = session.user?.user_metadata?.name;

    // Función para formatear fecha y hora
    const getFechaFormateada = (item: UserTicketT) => {
        const combinedDateTime = `${item.date}T${item.time}`;
        const dateObj = new Date(combinedDateTime);
        const dateFormatted = dateObj.toLocaleDateString('es-CR', {
            timeZone: 'America/Costa_Rica',
        });
        const horaFormateada = dateObj.toLocaleTimeString('es-CR', {
            timeZone: 'America/Costa_Rica',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true, // AM/PM
        });
        return `${dateFormatted} a las ${horaFormateada}`;
    };

    return (
        <div className="w-full min-h-screen bg-gradient-to-b from-sky-50 via-sky-100 to-stone-50
  dark:bg-gradient-to-b dark:from-[#2F3C51] dark:via-[#46586F] dark:to-[#2F3C51] transition-colors flex flex-col items-center py-14">
            {/* Botón volver y título */}
            <div className="w-full max-w-3xl mx-auto  flex items-center text-center">
                <Link
                    href={`/es/poxicards/orders/${orderId}`}
                    className="bg-gray-200 text-gray-800 p-1 mb-2 mx-2 rounded-md text-sm font-semibold hover:bg-gray-300 transition dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                    &larr; Regresar
                </Link>
                <h1 className="text-base sm:text-2xl font-bold">Detalles de la Orden</h1>
            </div>

            {/* Bloque de edición SINPE (si aplica) */}
            {canEdit && (
                <section className="w-full max-w-3xl mx-auto px-4 pb-2 mb-2   rounded-md border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h2 className="text-lg font-semibold mb-1">Editar referencia de pago (SINPE)</h2>
                    <form action={updatePaymentReference} className="space-y-3">
                        <input type="hidden" name="orderId" value={order.id} />

                        <div>
                            <label htmlFor="digits" className="block text-sm font-medium mb-1">
                                4 últimos dígitos
                            </label>
                            <input
                                type="text"
                                name="digits"
                                id="digits"
                                defaultValue={digits}
                                maxLength={4}
                                className="border border-gray-300 rounded w-full p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="bankName" className="block text-sm font-medium mb-1">
                                Banco
                            </label>
                            <select
                                name="bankName"
                                id="bankName"
                                defaultValue={bankName}
                                className="border border-gray-300 rounded w-full p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="">Seleccionar banco</option>
                                {bancos.map((banco) => (
                                    <option key={banco} value={banco}>
                                        {banco}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded text-sm hover:bg-blue-700"
                        >
                            Guardar Cambios
                        </button>
                    </form>
                </section>
            )}

            {/* Info general de la orden */}
            <section className="w-full max-w-3xl mx-auto px-4 pb-2 mb-2 rounded-md border border-gray-200 dark:border-gray-700 shadow-sm space-y-2">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                    <p><strong>Orden ID:</strong> {order.id}</p>
                    <p><strong>Correo:</strong> {correo}</p>
                    <p><strong>Nombre:</strong> {nombreUsuario}</p>
                    <p><strong>Método de Pago:</strong> {order.payment_method}</p>
                    <p><strong>Fecha Creación:</strong> {new Date(order.created_at).toLocaleDateString('es-CR', {
                        timeZone: 'America/Costa_Rica',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true, // fuerza AM/PM
                    })}</p>
                </div>
            </section>



            {/* Items de la orden */}
            <section className="w-full max-w-3xl mx-auto px-4 pb-2 mb-2 rounded-md border border-gray-200 dark:border-gray-700 shadow-sm">
                <h3 className="text-sm font-semibold mb-2">Poxicards en la orden</h3>
                {itemsError ? (
                    <p className="text-red-500 mt-2 text-sm">Error al cargar ítems: {itemsError.message}</p>
                ) : items && items.length > 0 ? (
                    <ul className="list-disc list-inside text-sm space-y-1">
                        {items.map((item) => (
                            <li key={item.id}>
                                {item.premio} &nbsp;
                                ({String(item.number).padStart(2, '0')} - {String(item.serie).padStart(3, '0') || "000"})
                                &nbsp; / {getFechaFormateada(item)}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm">No hay Poxicards asociados a esta orden.</p>
                )}
            </section>

            {/* Mensaje si NO se puede editar (aunque sea sinpe) */}
            {!canEdit && order.payment_method === 'sinpe' && (
                <p className="text-red-500 text-sm">
                    No es posible editar la referencia de pago (han pasado más de 24 horas).
                </p>
            )}
        </div>
    );
}
