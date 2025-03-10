"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/components/context/CartContext";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/app/supabase-provider/provider";
import Step3_PayPal from "@/components/user/StepPaypal";
import { supabase } from "@/lib/supabaseClient";
import { sendCartEmail } from "@/app/actions/sendCartEmail";
import { Database } from '@/types-db';
type UserTicket = Database['user_tickets'];

type PaymentMethod = "sinpe" | "paypal" | "transfer" | "card";
type PaymentStatus = "pending" | "paid";

// // Interfaz de ticket_types
// interface Ticket {
//   id: number;
//   premio: string;
//   min_number?: number;
//   max_number?: number;
//   min_serie?: number;
//   max_serie?: number;
//   date?: string;
//   time?: string;
//   costo: number;
//   image_url?: string;
// }

interface SelectedCombo {
  number: number | null;
  serie: number | null;
}

// Tabla de bancos, la dejas igual
const bancos = [
  { nombre: "Banco Nacional de Costa Rica (BNCR)", sms: "+2627", permiteSMS: true },
  { nombre: "Banco de Costa Rica (BCR)", sms: "+2276 (Solo Kolbi)", permiteSMS: true },
  { nombre: "BAC Credomatic", sms: "+7070-1222", permiteSMS: true },
  { nombre: "Banco Popular", permiteSMS: false },
  { nombre: "Davivienda", sms: "+7070 o +7474", permiteSMS: true },
  { nombre: "Scotiabank", permiteSMS: false },
  { nombre: "Banco Promerica", sms: "+6223 o +2450", permiteSMS: true },
  { nombre: "Banco Lafise", sms: "+9091", permiteSMS: true },
];

type Banco = {
  nombre: string;
  sms?: string;
  permiteSMS: boolean;
};

// ------------------------------ CheckoutWizardPage ------------------------------
export default function CheckoutWizardPage() {
  const router = useRouter();
  const {
    cart,
    clearCart,
    addNumberAndSerieToCart,
    removeFromCart,
    addManyToCartBuyed,
  } = useCart();

  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);

  // Estado: (ticketId) => { number, serie }
  const [selectedCombos, setSelectedCombos] = useState<Record<number, SelectedCombo>>({});

  // SINPE
  const [bancoSeleccionado, setBancoSeleccionado] = useState<Banco | null>(null);
  const [ultimos4, setUltimos4] = useState("");

  // Query de combos ocupados: { [ticketTypeId]: { [num: number]: number[] de series ocupadas } }
  const [combosOcupados, setCombosOcupados] = useState<Record<number, Record<number, number[]>>>({});

  const { session } = useSupabase();
  const userId = session?.user?.id || null;
  const correo = session?.user?.email;
  const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);

  // Al montar o cambiar el cart, fetch combos ocupados
  useEffect(() => {
    const fetchCombosOcupados = async () => {
      if (!cart || cart.length === 0) return;
      // Extract unique ticket_type_ids from the cart to avoid duplicate queries
      const ticketTypeIds = [...new Set(cart.map((t) => t.id))];

      // Consulta user_tickets con is_locked = true, para esos ticket_type_id
      const { data, error } = await supabase
        .from("user_tickets")
        .select("ticket_type_id, number, serie, is_locked")
        .in("ticket_type_id", ticketTypeIds);

      if (error) {
        console.error("Error al obtener combos ocupados:", error);
        return;
      }

      const mapOcupados: Record<number, Record<number, number[]>> = {};
      data?.forEach((row) => {
        if (!row.is_locked) return;
        const typeId = row.ticket_type_id as number;
        const num = row.number as number;
        const ser = row.serie as number;

        if (!mapOcupados[typeId]) {
          mapOcupados[typeId] = {};
        }
        if (!mapOcupados[typeId][num]) {
          mapOcupados[typeId][num] = [];
        }
        mapOcupados[typeId][num].push(ser);
      });

      setCombosOcupados(mapOcupados);
    };

    fetchCombosOcupados();
  }, [cart]);

  // -------------- Steps --------------
  const goNext = () => setCurrentStep((s) => s + 1);
  const goBack = () => setCurrentStep((s) => s - 1);

  // -------------- Step1: Handler: Seleccionar (número, serie) --------------
  const handleSelectNumber = (
    localTicketId: number,
    chosenNum: number,
    ticketInfo: UserTicket
  ) => {
    // Actualiza "number" y resetea la serie => elegimos una aleatoria
    const freeSeries = getFreeSeries(ticketInfo, chosenNum);
    let randomSerie: number = 0;
    if (freeSeries.length > 0) {
      const rndIndex = Math.floor(Math.random() * freeSeries.length);
      randomSerie = freeSeries[rndIndex];
    }

    setSelectedCombos((prev) => ({
      ...prev,
      [localTicketId]: {
        number: chosenNum,
        serie: randomSerie,
      },
    }));
    addNumberAndSerieToCart(localTicketId, chosenNum, randomSerie);
  };

  // Handler: si el usuario cambia manualmente la serie en el <select>
  const handleSelectSerie = (localTicketId: number, newSerie: number) => {
    setSelectedCombos((prev) => ({
      ...prev,
      [localTicketId]: {
        ...prev[localTicketId],
        serie: newSerie,
      },
    }));

    // Actualizar el carrito
    addNumberAndSerieToCart(localTicketId, selectedCombos[localTicketId].number as number, newSerie);
  };

  // Devuelve las series libres para (ticket, number)
  const getFreeSeries = (ticket: UserTicket, number: number) => {
    const minS = ticket.min_serie ?? 0;
    const maxS = ticket.max_serie ?? 999;
    const usedSeries =
      combosOcupados[ticket.id]?.[number] /* array de series ocupadas */ || [];

    const allSeries = Array.from({ length: maxS - minS + 1 }, (_, i) => i + minS);
    const free = allSeries.filter((ser) => !usedSeries.includes(ser));
    return free;
  };

  const validateStep1 = () => {
    // Asegurar que cada ticket tenga number y serie
    for (const item of cart) {
      const combo = selectedCombos[item.local_id];
      if (!combo || combo.number === null || combo.serie === null) {
        alert(`Falta seleccionar un número/serie para: ${item.premio}`);
        return;
      }
    }
    goNext();
  };

  // -------------- createOrder() y resto --------------
  const createOrder = async () => {
    // 1) Crear la orden en BD
    const totalAmount = cart.reduce((acc, t) => acc + t.costo, 0);

    // Creamos la orden con estado "pending"
    const { data: orderInsert, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        payment_method: paymentMethod,
        payment_status: "pending",
        total_amount: totalAmount
      })
      .select()
      .single();

    if (orderError || !orderInsert) {
      alert("Error creando la orden en la BD");
      return;
    }

    // 3) Guardamos orderId en el state
    setCreatedOrderId(orderInsert.id);

    // 4) (Opcional) No vaciamos el carrito todavía, porque no está pagado
    // Esperamos a la confirmación final en PayPal
  };

  const validateStep2 = () => {
    if (!paymentMethod) {
      alert("Debes seleccionar un método de pago");
      return;
    }
    createOrder();
    goNext();
  };

  const validateStep3 = () => {
    goNext();
  };

  const handlePayment = async () => {
    // ... Mismo que tu ejemplo, pero a la hora de insertar en user_tickets,
    // usas "number" Y "serie" del selectedCombos para cada item
    // Ejemplo:
    //
    //   const chosen = selectedCombos[item.id]; // {number, serie}
    //   await supabase.from("user_tickets").insert({
    //     ticket_type_id: item.id,
    //     number: chosen.number,
    //     serie: chosen.serie,
    //     ...
    //   })
    // ...

    let paymentStatus: "pending" | "paid" = "paid";
    // Validaciones para SINPE
    if (paymentMethod === "sinpe") {
      if (!bancoSeleccionado) {
        alert("Selecciona un banco para SINPE");
        return;
      }
      if (ultimos4.length !== 4) {
        alert("Faltan los últimos 4 dígitos del recibo");
        return;
      }

      let paymentReference: string | null = null;

      paymentStatus = "pending";
      paymentReference = `4 ultimos digitos: ${ultimos4} - Banco: ${bancoSeleccionado.nombre}`;

      // actualizar payment reference
      const { data: dataUpdate, error: errorUpdate } = await supabase
        .from("orders")
        .update({ payment_reference: paymentReference })
        .eq("id", createdOrderId)
        .select()
        .single();

      if (errorUpdate || !dataUpdate) {
        console.error("Error al actualizar la orden:", errorUpdate);
        alert("Hubo un error al procesar la orden. Intenta de nuevo.");
        return;
      }

      // 2) Insertar cada ticket en `user_tickets`, asociándolo a `order_id`
      for (const item of cart) {
        const chosen = selectedCombos[item.local_id];
        if (!chosen) continue;
        

        // - Si el pago es "pending", definimos is_locked = false
        // - Si el pago es "paid", definimos is_locked = true
        const isLockedValue = true;

        // Si está "paid", ponle la fecha de compra. Si "pending", déjalo en null (opcional)
        const purchaseDateValue = isLockedValue ? new Date() : null;

        const { error: ticketError } = await supabase.from("user_tickets").insert({
          ticket_type_id: item.id,
          user_id: userId,
          number: chosen.number,
          serie: chosen.serie,
          is_locked: isLockedValue,
          purchase_date: purchaseDateValue,
          order_id: dataUpdate.id // <-- asignamos el ID de la orden
        });

        if (ticketError) {
          console.error("Error insertando user_ticket:", ticketError);
          // Podrías plantearte rollback, o manejar de otra forma
        }
      }
    }
    else if (paymentMethod === "paypal") {
      // 2) Insertar tickets is_locked=false
      for (const item of cart) {
        const chosen = selectedCombos[item.local_id];
        if (!chosen) continue;
        
        const { error: ticketError } = await supabase.from("user_tickets").insert({
          ticket_type_id: item.id,
          user_id: userId,
          number: chosen.number,
          serie: chosen.serie,
          is_locked: false,
          purchase_date: null,
          order_id: createdOrderId
        });
        if (ticketError) {
          console.error("Error insertando user_tickets:", ticketError);
        }
      }
    }
    // else if (paymentMethod === "sinpe") {
    //   ...
    // } ...

    // 4) Navegar o mostrar mensaje
    if (paymentMethod === "sinpe") {
      // Si es SINPE => compra pendiente
      setPaymentStatus("pending");
      addManyToCartBuyed(cart);

      //cart copy
      

      if (correo) {
      const cartCopy = [...cart];
        await sendCartEmail(cartCopy, correo);
      }
      clearCart();
    } else if (paymentStatus === "paid") {
      // Pagos inmediatos
      setPaymentStatus("paid");
      addManyToCartBuyed(cart);

      if (correo) {
        const cartCopy = [...cart];
        await sendCartEmail(cartCopy, correo);
      }
      clearCart();
      //router.push(`/personalizar-tickets?order=${createdOrder.id}`);
    }
    validateStep3();
  };

  // -------------- Render principal --------------
  if (cart.length === 0 && paymentStatus === null) {
    return (
      <main className="max-w-3xl mx-auto p-6">
        <button onClick={() => router.back()} className="bg-gray-200 p-2 rounded-md">
          &larr; Regresar
        </button>
        <h1 className="text-2xl font-bold mt-4">Carrito vacío</h1>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      {/* Encabezado */}
      <header className="flex items-center gap-4 mb-6">
        {currentStep > 1 && currentStep <= 3 && (
          <button
            onClick={goBack}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md font-semibold hover:bg-gray-300 transition"
          >
            &larr; Paso anterior
          </button>
        )}
        {currentStep === 1 && (
          <button
            onClick={() => router.back()}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md font-semibold hover:bg-gray-300 transition"
          >
            &larr; Regresar
          </button>
        )}
        {currentStep >= 1 && currentStep <= 3 ? (
          <h1 className="text-2xl font-bold">Checkout (Paso {currentStep} de 3)</h1>
        ) : (
          <h1 className="text-2xl font-bold text-green-600">¡Compra realizada con éxito!</h1>
        )}
      </header>

      {/* Steps */}
      {currentStep === 1 && (
        <Step1_SelectNumbersSeries
          cart={cart}
          
          selectedCombos={selectedCombos}
          onSelectNumber={handleSelectNumber}
          onSelectSerie={handleSelectSerie}
          onContinue={validateStep1}
          getFreeSeries={getFreeSeries}
        />
      )}
      {currentStep === 2 && (
        <Step2_SelectMethod
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          onContinue={validateStep2}
          cart={cart}
          removeFromCart={removeFromCart}
        />
      )}
      {currentStep === 3 && (
        <Step3_PaymentDetails
          paymentMethod={paymentMethod as PaymentMethod}
          bancoSeleccionado={bancoSeleccionado}
          setBancoSeleccionado={setBancoSeleccionado}
          ultimos4={ultimos4}
          setUltimos4={setUltimos4}
          total={cart.reduce((acc, item) => acc + item.costo, 0)}
          onFinalize={handlePayment}
          createdOrderId={createdOrderId}
        />
      )}
      {currentStep === 4 && <Step4 paymentMethod={paymentMethod as PaymentMethod} createdOrderId={createdOrderId as number} />}
    </main>
  );
}

// -------------- STEP 1: Elegir número + serie --------------
function Step1_SelectNumbersSeries({
  cart,
  selectedCombos,
  onSelectNumber,
  onSelectSerie,
  onContinue,
  getFreeSeries,
}: {
  cart: UserTicket[];
  selectedCombos: Record<number, { number: number | null; serie: number | null }>;
  onSelectNumber: (localTicketId: number, chosenNum: number, ticketInfo: UserTicket) => void;
  onSelectSerie: (localTicketId: number, newSerie: number) => void;
  onContinue: () => void;
  getFreeSeries: (ticket: UserTicket, number: number) => number[];
}) {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Paso 1: Seleccionar Número y Serie</h2>

      {cart.map((ticket: UserTicket) => {
        const minNum = ticket.min_number ?? 0;
        const maxNum = ticket.max_number ?? 99;

        const chosenNum = selectedCombos[ticket.local_id]?.number;
        const chosenSerie = selectedCombos[ticket.local_id]?.serie;

        //crear un string de num + keyC

        // "ocupados" ahora es un recuento de cuántas series quedan para cada número
        // Pero para simplificar, solo marcamos como "disabled" un número si ya no tiene series libres
        const freeSeriesCountForNumber = (num: number) => {
          const allSeries = getFreeSeries(ticket, num);
          return allSeries.length;
        };

        return (
          <div key={ticket.local_id} className="mb-6 p-4 border rounded-md">
            <h3 className="font-bold mb-2">
              {ticket.premio} ({ticket.date} - {ticket.time?.slice(0, 5)})
            </h3>
            <p className="text-sm text-gray-600">
              Selecciona un número entre {minNum} y {maxNum}. Luego elige la serie.
            </p>

            <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-2 mt-2">
              {Array.from({ length: maxNum - minNum + 1 }, (_, i) => i + minNum).map((num) => {
                const countFree = freeSeriesCountForNumber(num);
                const isDisabled = countFree === 0; // si no hay series libres, se deshabilita
                const isChosen = chosenNum === num;
                return (
                  <button
                    key={num}
                    onClick={() => !isDisabled && onSelectNumber(ticket.local_id, num, ticket)}
                    disabled={isDisabled}
                    className={`p-2 text-sm font-bold rounded-md
                      ${isDisabled ? "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"
                        : isChosen ? "bg-indigo-500 text-white"
                          : "bg-white border border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                      }`}
                    title={
                      isDisabled
                        ? `Todas las series ocupadas`
                        : `Hay ${countFree} series disponibles`
                    }
                  >
                    {num < 10 ? `0${num}` : num}
                  </button>
                );
              })}
            </div>

            {/* Si el usuario ya eligió un número, mostramos la selección de serie */}
            {chosenNum != null && (
              <div className="mt-3 p-3 border rounded bg-gray-50">
                <p className="text-sm">
                  Número seleccionado:{" "}
                  <b>{chosenNum < 10 ? `0${chosenNum}` : chosenNum}</b>
                </p>
                <SelectSeries
                  ticket={ticket}
                  chosenNum={chosenNum}
                  chosenSerie={chosenSerie}
                  onSelectSerie={(serie) => onSelectSerie(ticket.local_id, serie)}
                  getFreeSeries={getFreeSeries}
                />
              </div>
            )}
          </div>
        );
      })}
      <button
        onClick={onContinue}
        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-500"
      >
        Continuar &rarr;
      </button>
    </section>
  );
}

// -------------- SelectSeries: Muestra un <select> con las series libres --------------
function SelectSeries({
  ticket,
  chosenNum,
  chosenSerie,
  onSelectSerie,
  getFreeSeries,
}: {
  ticket: UserTicket;
  chosenNum: number;
  chosenSerie: number | null;
  onSelectSerie: (serie: number) => void;
  getFreeSeries: (ticket: UserTicket, number: number) => number[];
}) {
  // Filtra las series libres y ordena
  const freeSeries = getFreeSeries(ticket, chosenNum);
  freeSeries.sort((a, b) => a - b);

  // Manejador local
  const handleChangeSerie = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newVal = parseInt(e.target.value, 10);
    onSelectSerie(newVal);
  };

  return (
    <div className="mt-2">
      <label className="block text-sm font-medium mb-1">Serie disponible:</label>
      <select
        value={chosenSerie ?? ""}
        onChange={handleChangeSerie}
        className="w-full p-2 border rounded"
      >
        <option value="">
          {freeSeries.length === 0 ? "No hay series libres" : "-- Selecciona serie --"}
        </option>
        {freeSeries.map((serie) => (
          <option key={serie} value={serie}>
            {serie.toString().padStart(3, "0")}
          </option>
        ))}
      </select>
    </div>
  );
}

// -------------- Step2_SelectMethod: sin cambios --------------
function Step2_SelectMethod({
  paymentMethod,
  setPaymentMethod,
  onContinue,
  cart,
  removeFromCart,
}: {
  paymentMethod: PaymentMethod | null;
  setPaymentMethod: (m: PaymentMethod) => void;
  onContinue: () => void;
  cart: UserTicket[];
  removeFromCart: (id: number) => void;
}) {
  const total = cart.reduce((acc, item) => acc + item.costo, 0);

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Paso 2: Método de Pago</h2>

      {/* Lista de items en el carrito, con opción de eliminarlos */}
      <div className="mb-4 bg-white rounded shadow p-4">
        {cart.map((item) => (
          <li key={item.local_id} className="flex items-center justify-between border-b py-2">
            <div>
              <span className="font-medium">{item.premio}</span>
            </div>
            <div className="flex items-center gap-4">
              <span>₡{item.costo}</span>
              <button
                onClick={() => removeFromCart(item.local_id)}
                className="text-red-500 hover:text-red-700 font-bold text-lg"
                title="Eliminar"
              >
                x
              </button>
            </div>
          </li>
        ))}
      </div>

      <p className="text-xl font-semibold mb-4">Total: ₡{total}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <PaymentOption
          label="SINPE"
          selected={paymentMethod === "sinpe"}
          onClick={() => setPaymentMethod("sinpe")}
          img="/sinpe.png"
        />
        <PaymentOption
          label="PayPal"
          selected={paymentMethod === "paypal"}
          onClick={() => setPaymentMethod("paypal")}
          img="/paypal.png"
        />
        <PaymentOption
          label="Transferencia"
          selected={paymentMethod === "transfer"}
          onClick={() => setPaymentMethod("transfer")}
          img="/transfer.webp"
        />
        <PaymentOption
          label="Tarjeta"
          selected={paymentMethod === "card"}
          onClick={() => setPaymentMethod("card")}
          img="/tarjeta.png"
        />
      </div>

      <button
        onClick={onContinue}
        className="mt-6 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-500"
      >
        Continuar &rarr;
      </button>
    </section>
  );
}

/** Botón estilo */
function PaymentOption({
  label,
  selected,
  onClick,
  img,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  img: string;
}) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer p-4 border-2 rounded-lg text-center transition ${selected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-400"
        }`}
    >
      <img src={img} alt={label} className="mx-auto w-16 h-16 object-contain" />
      <span className="block mt-2 font-semibold">{label}</span>
    </div>
  );
}

/* STEP 3: Detalles de pago (distintos según método) + Confirmar */
function Step3_PaymentDetails({
  paymentMethod,
  bancoSeleccionado,
  setBancoSeleccionado,
  ultimos4,
  setUltimos4,
  total,
  onFinalize,
  createdOrderId,

}: {
  paymentMethod: PaymentMethod;

  bancoSeleccionado: Banco | null;
  setBancoSeleccionado: (v: Banco | null) => void;
  ultimos4: string;
  setUltimos4: (v: string) => void;
  total: number;
  onFinalize: () => void;
  createdOrderId: number | null;

}) {
  const copiarMensaje = () => {
    if (bancoSeleccionado?.permiteSMS) {
      const mensaje = `PASE 1000 8888-9999`;
      navigator.clipboard.writeText(mensaje);
      alert("Mensaje copiado al portapapeles");
    }
  };
  const handleBancoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const banco = bancos.find((b) => b.nombre === e.target.value);
    setBancoSeleccionado(banco || null);
  };
  // Render condicional según método
  const renderPaymentForm = () => {
    switch (paymentMethod) {
      case "sinpe":
        return (
          <div className="mt-4 bg-blue-50 border border-blue-300 rounded-md p-4">
            <p className="text-sm mb-2">
              Monto total: <b>₡{total}</b>.
              Envia tu pago vía Sinpe con la siguiente info:
            </p>
            <label className="block mb-1 text-sm font-medium">Selecciona Banco:</label>
            <select
              value={bancoSeleccionado?.nombre || ""}
              onChange={handleBancoChange}
              className="w-full p-2 border rounded-md mb-2"
            >
              <option value="">-- Selecciona Banco --</option>
              {bancos.map((b, idx) => (
                <option key={idx} value={b.nombre}>
                  {b.nombre}
                </option>
              ))}
            </select>
            {/* Instrucciones dinámicas */}
            {bancoSeleccionado && (
              <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">
                {bancoSeleccionado.permiteSMS ? (
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-gray-700 dark:text-gray-300">
                        📲 Enviar SMS a: <b>{bancoSeleccionado.sms}</b>
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        💬 Mensaje: <b>PASE {total} 8585-0000</b>
                      </p>
                    </div>
                    <button
                      onClick={copiarMensaje}
                      className="mt-2 sm:mt-0 sm:w-auto text-sm bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md"
                    >
                      📋 Copiar Mensaje
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-700 dark:text-gray-300">
                    📱 Realiza la transferencia desde la app o banca en línea de <b>{bancoSeleccionado.nombre}</b>.
                  </p>
                )}
              </div>
            )}


            <label className="block mb-1 text-sm font-medium">Últimos 4 dígitos del recibo:</label>
            <input
              type="text"
              maxLength={4}
              value={ultimos4}
              onChange={(e) => setUltimos4(e.target.value)}
              className="w-full p-2 border rounded-md mb-2"
            />
            {/* Podrías mostrar un botón para "Copiar mensaje" si el banco lo permite, etc. */}
            <button
              onClick={onFinalize}
              className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md"
            >
              Confirmar y Finalizar
            </button>
          </div>
        );
      case "paypal":
        return (
          <div className="p-4 bg-blue-50 border border-blue-300 text-blue-800 rounded-md text-center mb-2">
            {/* <p className="text-sm md:text-base">Paypal.</p> */}
            {createdOrderId && (
              <Step3_PayPal
                createdOrderId={createdOrderId}
                onPaymentSuccess={() => {
                  onFinalize();
                }}
                onPaymentError={(msg) => {
                  alert(msg);
                }}
              />
            )}
          </div>
        );
      case "transfer":
        return (
          <div className="p-4 bg-blue-50 border border-blue-300 text-blue-800 rounded-md text-center mb-2">
            <p className="text-sm md:text-base">Instrucciones para transferencia bancaria.</p>
          </div>
        );
      case "card":
        return (
          <div className="p-4 bg-blue-50 border border-blue-300 text-blue-800 rounded-md text-center mb-2">
            <p className="text-sm md:text-base">Formulario de tarjeta de crédito/débito (Stripe, etc.).</p>
          </div>
        );
      default:
        return (
          <div className="p-4 bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-md text-center mb-2">
            <p className="text-sm md:text-base">Por favor seleccione un método de pago</p>
          </div>
        );
    }
  };

  return (
    <section>
      <h2 className="text-xl font-semibold">Paso 3: Completa tu Pago</h2>
      {renderPaymentForm()}


    </section>
  );
}

interface Step4Props {
  paymentMethod: PaymentMethod;
  createdOrderId: number;

}

function Step4({ paymentMethod, createdOrderId }: Step4Props) {
  const router = useRouter();

  // const handleDownload = () => {
  //   // Al descargar, se activa el proceso de auto personalización
  //   console.log("Cart BUYED: ", cartBuyed);
  //   //window.location.href = `/api/download?order=${createdOrderId}`;
  // };

  const handlePersonalize = () => {
    router.push(`/poxicards/checkout/customize`);
  };

  return (
    <section className="mt-6 p-6 bg-green-100 border border-green-300 rounded-lg shadow-md">
      <p className="text-lg text-gray-700 mb-6">
        Tu compra se ha procesado correctamente. Al descargar tus PoxiCards se iniciará automáticamente un proceso de personalización para que puedas comenzar a disfrutar de ellas de inmediato.
      </p>
      {paymentMethod === "sinpe" && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md">
          <p className="text-sm">
            Nota: Si elegiste SINPE, se validará el pago. En caso de no confirmarse, la compra podrá ser anulada.
          </p>
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* <button
          onClick={handleDownload}
          className="flex-1 px-4 py-3 bg-blue-600 text-white font-bold rounded-md shadow hover:bg-blue-700 transition"
        >
          Descargar y Auto Personalizar
        </button> */}
        <button
          onClick={handlePersonalize}
          className="flex-1 px-4 py-3 bg-green-600 text-white font-bold rounded-md shadow hover:bg-green-700 transition"
        >
          Personalización Manual
        </button>
      </div>
    </section>
  );
}
