import { NextResponse } from "next/server"

// Simulación de datos que vendrían de una base de datos externa
const courtsFromBackend = [
  { id: "court1", name: "Cancha Principal", type: "Fútbol 11" },
  { id: "court2", name: "Cancha Auxiliar", type: "Fútbol 7" },
  { id: "court3", name: "Cancha Cubierta", type: "Fútbol 5" },
  { id: "court4", name: "Cancha de Tenis", type: "Tenis" },
  { id: "court5", name: "Cancha Multideporte", type: "Básquet/Vóley" },
]

export async function GET() {
  // Simulamos un pequeño retraso para imitar una API real
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Simulamos una conexión a un backend externo
  // En un caso real, aquí iría una llamada fetch a una API externa o una consulta a base de datos

  return NextResponse.json({ courts: courtsFromBackend })
}