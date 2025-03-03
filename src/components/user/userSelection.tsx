// Sección client para elegir número y serie
'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function UserSelection({
  ticketTypeId,
  minNumber,
  maxNumber,
  minSeries,
  maxSeries
}: {
  ticketTypeId: number,
  minNumber: number,
  maxNumber: number,
  minSeries: number,
  maxSeries: number
}) {
  const router = useRouter()
  const [number, setNumber] = useState(minNumber)
  const [series, setSeries] = useState(minSeries)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleBuy = async () => {
    setLoading(true)
    setError('')
    try {
      console.log("ticketTypeId component: ", ticketTypeId)
      console.log("number component: ", number)
      console.log("series component: ", series)
      const res = await fetch('/api/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketTypeId,
          number,
          series
        })
      })
      console.log("res: ", res)
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al comprar')
      }
      // Si todo sale bien, nos devuelve el id del user_tickets
      const { purchaseId } = await res.json()
      // Redireccionamos a la página de edición
      router.push(`/tickets/edit/${purchaseId}`)
    } catch (err: Error | unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-4">
      <div className="flex gap-4">
        <div>
          <label className="block">Número</label>
          <input
            type="number"
            value={number}
            min={minNumber}
            max={maxNumber}
            onChange={(e) => setNumber(Number(e.target.value))}
            className="border p-1 border-stone-950 rounded bg-gray-400 text-black"
          />
        </div>
        <div>
          <label className="block">Serie</label>
          <input
            type="number"
            value={series}
            min={minSeries}
            max={maxSeries}
            onChange={(e) => setSeries(Number(e.target.value))}
            className="border p-1 border-stone-950 rounded bg-gray-400 text-black"
          />
        </div>
      </div>

      <button
        onClick={handleBuy}
        disabled={loading}
        className="bg-green-600 text-white py-2 px-4 rounded mt-4"
      >
        {loading ? 'Procesando...' : 'Comprar'}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  )
}
