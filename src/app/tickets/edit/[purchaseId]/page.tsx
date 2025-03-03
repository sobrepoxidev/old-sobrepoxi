// src/app/tickets/edit/[purchaseId]/page.tsx
'use client'
import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import { Stage, Layer, Text } from 'react-konva'

export default function EditUserTicketPage() {
  const params = useParams()
  const purchaseId = params?.purchaseId
  const stageRef = useRef<any>(null)
  const [ticket, setTicket] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // 1) Cargar datos del user_tickets (podrías mostrar el número, la serie, etc.)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/tickets/${purchaseId}`)
        if (!res.ok) {
          console.error(await res.json())
          return
        }
        const { ticket } = await res.json()
        setTicket(ticket)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    if (purchaseId) fetchData()
  }, [purchaseId])

  const handleDownload = () => {
    if (stageRef.current) {
      const uri = stageRef.current.toDataURL()
      const link = document.createElement('a')
      link.download = 'ticket.png'
      link.href = uri
      link.click()
    }
  }

  if (loading) return <div className="p-4">Cargando...</div>
  if (!ticket) return <div className="p-4">No se encontró el ticket</div>

  // Muestra el número/serie reales
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Editar Ticket #{ticket.id}</h1>
      <p>Número: {ticket.number}</p>
      <p>Serie: {ticket.series}</p>

      <div className="mt-4">
        <Stage width={300} height={200} ref={stageRef}>
          <Layer>
            <Text
              text={`N° ${ticket.number} - Serie ${ticket.series}`}
              x={10}
              y={10}
              fontSize={16}
              fill="blue"
            />
            {/* Podrías añadir un background con <Image> o más elementos de Konva */}
          </Layer>
        </Stage>
      </div>

      <button
        onClick={handleDownload}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Descargar
      </button>
    </div>
  )
}
