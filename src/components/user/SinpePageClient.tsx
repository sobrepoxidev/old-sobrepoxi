"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabaseClient";

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

interface SinpePaymentProps {
    ticketIds: number[]; // Ahora es una lista de números
    minNumber: number;
    maxNumber: number;
    total: number;
  }
export default function SinpePayment({ ticketIds, minNumber, maxNumber, total }: SinpePaymentProps) {
  const router = useRouter();
  type Banco = {
    nombre: string;
    sms?: string;
    permiteSMS: boolean;
  };
  
  const [bancoSeleccionado, setBancoSeleccionado] = useState<Banco | null>(null);
  const [ultimos4, setUltimos4] = useState("");
  const [numerosOcupados, setNumerosOcupados] = useState<number[]>([]);
  const [numeroSeleccionado, setNumeroSeleccionado] = useState<number | null>(null);

  useEffect(() => {
    const fetchNumerosOcupados = async () => {
      if (!ticketIds || ticketIds.length === 0) return; // Evitar consultas innecesarias

        console.log("\n----- Ticket IDs: ", ticketIds);
      const { data, error } = await supabase
        .from("user_tickets")
        .select("number, ticket_type_id") // Seleccionamos también `ticket_type_id` para referencia
        .in("ticket_type_id", ticketIds); // Filtrar por una lista de IDs
  
      if (error) {
        console.error("Error obteniendo números ocupados:", error);
      } else {
        // Convertimos los resultados en un mapa { ticket_type_id: [numeros] }
        const numerosPorTicket = data.reduce((acc: Record<number, number[]>, item: any) => {
          if (!acc[item.ticket_type_id]) acc[item.ticket_type_id] = [];
          acc[item.ticket_type_id].push(item.number);
          return acc;
        }, {});

        //lista de solo los números de numerosPorTicket
        const numeros = Object.values(numerosPorTicket).flat();
        console.log("\n----- Numeros ocupados: ", numeros);
        setNumerosOcupados(numeros); // Guardamos el objeto en el estado
  
        //setNumerosOcupados(numerosPorTicket); // Guardamos el objeto en el estado
      }
    };
  
    fetchNumerosOcupados();
  }, [ticketIds]);
  

  const handleBancoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const banco = bancos.find((b) => b.nombre === e.target.value);
    setBancoSeleccionado(banco || null);
  };

  const copiarMensaje = () => {
    if (bancoSeleccionado?.permiteSMS) {
      const mensaje = `PASE 1000 8888-9999`;
      navigator.clipboard.writeText(mensaje);
      alert("Mensaje copiado al portapapeles");
    }
  };

  const continuar = () => {
    if (!numeroSeleccionado) {
      alert("Debes seleccionar un número para el sorteo.");
      return;
    }

    if (ultimos4.length !== 4) {
      alert("Ingresa los últimos 4 dígitos del recibo.");
      return;
    }

    router.push("/personalizar-ticket");
  };

  return (
    <div className="mt-6 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">💵 Pago por Sinpe Móvil</h2>
  
      {/* Selección de banco */}
      <label className="block text-gray-700 dark:text-gray-300">Banco:</label>
      <select
        onChange={handleBancoChange}
        className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900"
      >
        <option value="">Seleccionar Banco</option>
        {bancos.map((banco, index) => (
          <option key={index} value={banco.nombre}>
            {banco.nombre}
          </option>
        ))}
      </select>
  
      {/* Instrucciones dinámicas */}
      {bancoSeleccionado && (
        <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">
          {bancoSeleccionado.permiteSMS ? (
            <>
              <p className="text-gray-700 dark:text-gray-300">📲 Enviar SMS a: <b>{bancoSeleccionado.sms}</b></p>
              <p className="text-gray-700 dark:text-gray-300">💬 Mensaje: <b>PASE {total} 8585-0000</b></p>
              <button
                onClick={copiarMensaje}
                className="mt-2 w-full text-sm bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-md"
              >
                📋 Copiar Mensaje
              </button>
            </>
          ) : (
            <p className="text-gray-700 dark:text-gray-300">
              📱 Realiza la transferencia desde la app o banca en línea de <b>{bancoSeleccionado.nombre}</b>.
            </p>
          )}
        </div>
      )}
  
      {/* Últimos 4 dígitos del recibo */}
      <div className="mt-4">
        <label className="block text-gray-700 dark:text-gray-300 text-sm">🔢 Últimos 4 dígitos del recibo:</label>
        <input
          type="text"
          maxLength={4}
          value={ultimos4}
          onChange={(e) => setUltimos4(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md"
        />
      </div>
  
      {/* 🏆 Selector de Número optimizado */}
      <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center">🎟️ Selecciona tu Número</h3>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 mt-4">
          {Array.from({ length: maxNumber - minNumber + 1 }, (_, i) => minNumber + i).map((num) => (
            <button
              key={num}
              onClick={() => !numerosOcupados.includes(num) && setNumeroSeleccionado(num)}
              className={`w-12 h-12 flex items-center justify-center text-sm font-bold rounded-md ${
                numerosOcupados.includes(num)
                  ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                  : numeroSeleccionado === num
                  ? "bg-indigo-500 text-white"
                  : "bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700"
              }`}
              disabled={numerosOcupados.includes(num)}
            >
              {num < 10 ? `0${num}` : num}
            </button>
          ))}
        </div>
      </div>
  
      {/* Botón Continuar */}
      <button
        onClick={continuar}
        className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md"
      >
        Confirmar pago y continuar 
      </button>
    </div>
  );
  
}
