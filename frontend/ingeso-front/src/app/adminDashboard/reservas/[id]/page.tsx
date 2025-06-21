"use client"

import { useParams, useRouter } from "next/navigation"
import AdminModificarReserva from "@/components/adminmodificar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function ModificarReservaPage() {
  const params = useParams()
  const router = useRouter()
  const reservaId = Number(params.id)

  if (!reservaId || isNaN(reservaId)) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-medium mb-2">ID de reserva inválido</h3>
            <p className="text-muted-foreground mb-4">No se pudo encontrar la reserva solicitada.</p>
            <Button onClick={() => router.push("/admin/reservas")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Reservas
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <AdminModificarReserva reservaId={reservaId} onClose={() => router.push("/adminDashboard/reservas")} />
    </div>
  )
}
