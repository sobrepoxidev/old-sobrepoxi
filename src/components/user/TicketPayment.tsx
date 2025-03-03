"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

export default function TicketPayment() {
  const router = useRouter();
  const [bancoSeleccionado, setBancoSeleccionado] = useState<Banco | null>(null);
  const [ultimos4, setUltimos4] = useState("");

interface Banco {
    nombre: string;
    sms?: string;
    permiteSMS: boolean;
}

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
    if (ultimos4.length !== 4) {
      alert("Ingresa los últimos 4 dígitos del recibo.");
      return;
    }
    router.push("/personalizar-ticket");
  };

  return (
    <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">💵 Pago por Sinpe Móvil</h2>

      {/* Selección de banco */}
      <label className="block text-gray-700 dark:text-gray-300 mt-3">
        Banco:
      </label>
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
              <p className="text-gray-700 dark:text-gray-300">💬 Mensaje: <b>PASE 5000 8888-9999</b></p>
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
        <label className="block text-gray-700 dark:text-gray-300 text-sm">
          🔢 Últimos 4 dígitos del recibo:
        </label>
        <input
          type="text"
          maxLength={4}
          value={ultimos4}
          onChange={(e) => setUltimos4(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md"
        />
      </div>

      {/* Botón Continuar */}
      <button
        onClick={continuar}
        className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md"
      >
        🎟️ Continuar
      </button>
    </div>
  );
}
