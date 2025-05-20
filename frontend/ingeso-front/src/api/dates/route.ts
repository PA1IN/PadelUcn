import { NextResponse } from "next/server"

// Función auxiliar para formatear fechas en formato YYYY-MM-DD sin dependencias externas
function formatDateToYYYYMMDD(date: Date): string {
  const year = date.getFullYear()
  // getMonth() devuelve 0-11, por lo que sumamos 1 y aseguramos formato de dos dígitos
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

export async function GET() {
  // Simulamos un pequeño retraso para imitar una API real
  await new Promise((resolve) => setTimeout(resolve, 200))

  // En un caso real, esta lógica estaría en el backend y posiblemente
  // consultaría una base de datos para obtener fechas disponibles
  const dates: string[] = []
  const today = new Date()

  for (let i = 0; i < 30; i++) {
    const date = new Date()
    date.setDate(today.getDate() + i)
    dates.push(formatDateToYYYYMMDD(date))
  }

  return NextResponse.json({ dates })
}