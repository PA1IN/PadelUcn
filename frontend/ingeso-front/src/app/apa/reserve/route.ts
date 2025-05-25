import { NextResponse } from "next/server"

export async function POST(request: Request) {
  // Simulamos un pequeño retraso para imitar una API real
  await new Promise((resolve) => setTimeout(resolve, 500))

  try {
    const data = await request.json()

    // Validamos que los campos requeridos estén presentes
    if (!data.courtId || !data.date || !data.time) {
      return NextResponse.json({ success: false, message: "Faltan campos obligatorios" }, { status: 400 })
    }

    // En un caso real, aquí se conectaría con una base de datos
    // para guardar la reserva y verificar disponibilidad

    // Simulamos una respuesta exitosa del backend
    return NextResponse.json({
      success: true,
      message: "Reserva creada exitosamente",
      reservationId: `RES-${Math.floor(Math.random() * 10000)}`,
      reservation: data,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error al procesar la solicitud" }, { status: 500 })
  }
}
