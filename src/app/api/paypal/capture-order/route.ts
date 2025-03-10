// app/api/paypal/capture-order/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient"; // Ajusta según tu proyecto
import { getPaypalAccessToken, capturePaypalOrder } from "../paypalHelpers";

export async function POST(request: NextRequest) {
  try {
    const { paypalOrderId, orderId } = await request.json();
    if (!paypalOrderId || !orderId) {
      return NextResponse.json({ error: "Missing arguments" }, { status: 400 });
    }

    //1) Capturar la orden en PayPal
    const accessToken = await getPaypalAccessToken();
    const captureResult = await capturePaypalOrder({
      accessToken,
      paypalOrderId
    });

    //Evalúa si fue exitosa
    if (captureResult.status !== "COMPLETED") {
      return NextResponse.json({ status: "FAILED" }, { status: 400 });
    }

    // 2) Actualizar la orden en la BD a 'paid'
    const { error: updateOrderError } = await supabase
      .from("orders")
      .update({
        payment_status: "paid",
        payment_reference: paypalOrderId
      })
      .eq("id", orderId);

    if (updateOrderError) {
      console.error("Error updating order:", updateOrderError);
      return NextResponse.json({ error: "Error updating order" }, { status: 500 });
    }

    // 3) Marcar tickets de esa orden como is_locked = true
    const { error: updateTicketsError } = await supabase
      .from("user_tickets")
      .update({
        is_locked: true,
        purchase_date: new Date()
      })
      .eq("order_id", orderId);

    if (updateTicketsError) {
      console.error("Error updating tickets:", updateTicketsError);
      return NextResponse.json({ error: "Error updating tickets" }, { status: 500 });
    }

    return NextResponse.json({ status: "COMPLETED" }, { status: 200 });
  } catch (err: unknown) {
    console.error("Error captureOrder route:", err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
