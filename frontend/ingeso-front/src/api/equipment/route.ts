import { NextResponse } from "next/server"

// Simulación de datos que vendrían de una base de datos externa
const equipmentsFromBackend = [
  { id: "eq1", name: "Pelotas" },
  { id: "eq2", name: "Petos" },
  { id: "eq3", name: "Arcos móviles" },
  { id: "eq4", name: "Redes" },
  { id: "eq5", name: "Conos" },
]

export async function GET(request: Request) {
  // Simulamos un pequeño retraso para imitar una API real
  await new Promise((resolve) => setTimeout(resolve, 200))

  const { searchParams } = new URL(request.url)
  const time = searchParams.get("time")

  if (!time) {
    return NextResponse.json({ error: "Hora no proporcionada" }, { status: 400 })
  }

  // Simulamos una consulta a base de datos que filtra según la hora
  const hour = Number.parseInt(time.split(":")[0])
  let availableEquipment = [...equipmentsFromBackend]

  if (hour >= 17) {
    availableEquipment = equipmentsFromBackend.filter((e) => e.id !== "eq3" && e.id !== "eq4")
  } else if (hour >= 12) {
    availableEquipment = equipmentsFromBackend.filter((e) => e.id !== "eq3")
  }

  return NextResponse.json({ equipment: availableEquipment })
}
