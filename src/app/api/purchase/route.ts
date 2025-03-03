// src/app/api/purchase/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const { ticketTypeId, number, series } = await req.json()
    console.log("ticketTypeId server: ", ticketTypeId)
    console.log("number server: ", number)
    console.log("series server: ", series)

    if (!ticketTypeId || number === undefined || series === undefined) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    // Ideal: Service role key guardada en .env (NO en NEXT_PUBLIC_).
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
      || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    const supabase = createClient(supabaseUrl, supabaseKey)

    // 1) Consulta ticket_types para ver si unique_selection es true
    const { data: ticketType, error: typeError } = await supabase
      .from('ticket_types')
      .select('*')
      .eq('id', ticketTypeId)
      .single()

    if (typeError || !ticketType) {
      return NextResponse.json({ error: 'No existe el tipo de ticket' }, { status: 404 })
    }

    // Si unique_selection = true, verificamos que no exista un user_tickets 
    // con (ticketTypeId, number, series, is_locked=true).
    if (ticketType.unique_selection) {
      const { data: existing } = await supabase
        .from('user_tickets')
        .select('*')
        .eq('ticket_type_id', ticketTypeId)
        .eq('number', number)
        .eq('series', series)
        .eq('is_locked', true)
        .single()

      if (existing) {
        return NextResponse.json({ error: 'Ese número/serie ya está vendido' }, { status: 409 })
      }
    }

    // 2) Crear el registro en user_tickets (bloqueándolo)
    // Nota: user_id se omite en la demo, en un real scenario extraerías 
    // el userId del JWT (auth).
    const { data: purchase, error: purchaseError } = await supabase
      .from('user_tickets')
      .insert({
        ticket_type_id: ticketTypeId,
        number,
        series,
        is_locked: true,
        purchase_date: new Date()
      })
      .select()
      .single()

    if (purchaseError || !purchase) {
      return NextResponse.json({ error: purchaseError?.message || 'Error al crear compra' }, { status: 400 })
    }

    // 3) Devolver el id del user_tickets
    return NextResponse.json({ purchaseId: purchase.id })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
