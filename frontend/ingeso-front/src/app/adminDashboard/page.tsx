'use client';
import Link from "next/link";

export default function AdminDashboardPage() {
    return (
        <div className="p-6">
            <h1 className="text-3x1 front-bold mb-6">Panel de Administrador</h1>
            <p className="text-gray-700 mb-4">Bienvenido al panel de administracion. Seleccione una seccion:</p>

            <ul className="list-disc ml-6 texxt-blue-600 space-y-2 underline">
                <li>
                    <Link href="/adminDashboard/reservas"> Ver reservas </Link>
                </li>
                <li>
                    <Link href="/adminDashboard/clientes"> Ver clientes </Link>
                </li>    
                    <Link href="/adminDashboard/historial-ventas"> Historial de ventas </Link>
                <li>    
                    <Link href= "/adminDashboard/recordatorios"> Recordatorios </Link>
                </li>    
                    <Link href="/adminDashboard/canchas"> Gestion de canchas </Link>
                <li>    
                    <Link href="/adminDashboard/equipamiento"> Gestion de Equipamiento </Link>
                </li>
                <li>    
                    <Link href="/adminDashboard/estadisticas"> Ver estadisticas </Link>
                </li>

            </ul>

        </div>
    )
}