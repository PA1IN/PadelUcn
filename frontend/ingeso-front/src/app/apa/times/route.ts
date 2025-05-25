import { NextResponse } from "next/server"

export async function GET(request: Request) {
  // Simulamos un pequeño retraso para imitar una API real
  await new Promise((resolve) => setTimeout(resolve, 250))

  const { searchParams } = new URL(request.url)
  const date = searchParams.get("date")

  if (!date) {
    return NextResponse.json({ error: "Fecha no proporcionada" }, { status: 400 })
  }

  // En un caso real, esta lógica estaría en el backend y consultaría
  // una base de datos para obtener horas disponibles según la fecha
  const selectedDate = new Date(date)
  const day = selectedDate.getDay()
  const isWeekend = day === 0 || day === 6

  // Más horas disponibles en fin de semana
  const times = isWeekend
    ? ["09:00", "10:00", "11:00", "12:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"]
    : ["15:00", "16:00", "17:00", "18:00", "19:00"]

  return NextResponse.json({ times })
}
