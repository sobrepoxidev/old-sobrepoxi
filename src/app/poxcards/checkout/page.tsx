"use client";

import { useState } from "react";
import { useCart } from "@/components/context/CartContext";
import SinpePayment from "@/components/user/SinpePageClient";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  // Se extraen la funciones del carrito, incluyendo removeFromCart
  const { cart, clearCart, removeFromCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<"sinpe" | "paypal" | "transfer" | "card" | null>("sinpe");

  // Calcula el total al renderizar (se actualiza al eliminar)
  const total = cart.reduce((acc, item) => acc + item.costo, 0);

  // ID de todos los tickets en el carrito
  const ticketsIds = cart.map((item) => item.id);

  // Handler para el pago (opcional, aquí comentado)
  const handlePayment = () => {
    switch (paymentMethod) {
      case "sinpe":
        alert(`Pago por SINPE. Total: ₡${total}`);
        clearCart();
        break;
      case "paypal":
        alert(`Redirigiendo a PayPal. Total: ₡${total}`);
        clearCart();
        break;
      case "transfer":
        alert(`Info para transferencia bancaria: ₡${total} ...`);
        clearCart();
        break;
      case "card":
        alert(`Pago con tarjeta: ₡${total} ...`);
        clearCart();
        break;
      default:
        alert("Selecciona un método de pago");
    }
  };

  // Si el carrito está vacío, lo indicamos
  if (cart.length === 0) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2
                       rounded-md font-semibold hover:bg-gray-300 transition"
          >
            <span className="text-xl">&larr;</span>
            <span>Regresar</span>
          </button>
          <h1 className="text-2xl font-bold">Carrito vacío</h1>
        </div>
        <p>Regresa a comprar tus tickets. ¡La suerte te espera!</p>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-6 md:px-12 lg:px-6 py-10">
      {/* Header con botón "Regresar" y título */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2
                       rounded-md font-semibold hover:bg-gray-300 transition"
          >
            <span className="text-xl">&larr;</span>
            <span>Regresar</span>
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Checkout
          </h1>
        </div>
      </header>

      {/* Lista de items en el carrito */}
      <ul className="mb-4 bg-white rounded shadow p-4">
        {cart.map((item) => (
          <li key={item.id} className="flex items-center justify-between border-b py-2">
            <div>
              <span className="font-medium">{item.premio}</span>
            </div>

            <div className="flex items-center gap-4">
              <span>₡{item.costo}</span>
              {/* Botón para eliminar un ticket del carrito */}
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:text-red-700 font-bold text-lg"
                title="Eliminar"
              >
                x
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Total actualizado */}
      <p className="text-xl font-semibold mb-4">Total: ₡{total}</p>

      {/* Selecciona método de pago */}
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-2">Selecciona tu método de pago:</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Opción SINPE */}
          <div
            onClick={() => setPaymentMethod("sinpe")}
            className={`cursor-pointer p-4 border-2 rounded-lg text-center 
              ${
                paymentMethod === "sinpe"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-400"
              } transition`}
          >
            <img
              src="/sinpe.png"
              alt="SINPE"
              className="mx-auto w-16 h-16 object-contain"
            />
            <span className="block mt-2 font-semibold">SINPE</span>
          </div>

          {/* Opción PayPal */}
          <div
            onClick={() => setPaymentMethod("paypal")}
            className={`cursor-pointer p-4 border-2 rounded-lg text-center 
              ${
                paymentMethod === "paypal"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-400"
              } transition`}
          >
            <img
              src="/paypal.png"
              alt="PayPal"
              className="mx-auto w-16 h-16 object-contain"
            />
            <span className="block mt-2 font-semibold">PayPal</span>
          </div>

          {/* Opción Transferencia */}
          <div
            onClick={() => setPaymentMethod("transfer")}
            className={`cursor-pointer p-4 border-2 rounded-lg text-center 
              ${
                paymentMethod === "transfer"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-400"
              } transition`}
          >
            <img
              src="/transfer.webp"
              alt="Transferencia Bancaria"
              className="mx-auto w-16 h-16 object-contain"
            />
            <span className="block mt-2 font-semibold">Transferencia</span>
          </div>

          {/* Opción Tarjeta */}
          <div
            onClick={() => setPaymentMethod("card")}
            className={`cursor-pointer p-4 border-2 rounded-lg text-center 
              ${
                paymentMethod === "card"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-400"
              } transition`}
          >
            <img
              src="/tarjeta.png"
              alt="Tarjeta de Crédito/Débito"
              className="mx-auto w-16 h-16 object-contain"
            />
            <span className="block mt-2 font-semibold">Tarjeta</span>
          </div>
        </div>
      </div>

      {/* Vista previa / configuración del método de pago */}
      <div>
        {paymentMethod === "sinpe" ? (
          <SinpePayment
            ticketIds={ticketsIds}
            minNumber={0}
            maxNumber={99}
            total={total}
          />
        ) : paymentMethod === "paypal" ? (
          <div className="p-4 bg-blue-50 border border-blue-300 text-blue-800 rounded-md text-center mb-2">
            <p className="text-sm md:text-base">Pagar con PayPal</p>
          </div>
        ) : paymentMethod === "transfer" ? (
          <div className="p-4 bg-blue-50 border border-blue-300 text-blue-800 rounded-md text-center mb-2">
            <p className="text-sm md:text-base">Pagar con Transferencia</p>
          </div>
        ) : paymentMethod === "card" ? (
          <div className="p-4 bg-blue-50 border border-blue-300 text-blue-800 rounded-md text-center mb-2">
            <p className="text-sm md:text-base">Pagar con Tarjeta</p>
          </div>
        ) : (
          <div className="p-4 bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-md text-center mb-2">
            <p className="text-sm md:text-base">Por favor seleccione un método de pago</p>
          </div>
        )}
      </div>

      {/* Botón Finalizar (opcional) */}
      {/* <button
        onClick={handlePayment}
        className="px-4 py-2 bg-indigo-600 text-white font-bold 
                   rounded hover:bg-indigo-500 transition mt-4"
      >
        Finalizar pago
      </button> */}
    </main>
  );
}
