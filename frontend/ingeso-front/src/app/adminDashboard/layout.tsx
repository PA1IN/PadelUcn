import React from 'react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode}) {
    return (
        <div className="flex min-h-screen">
        <aside className="w-64 bg-gray-800 text-white p-4">
            <h2 className="text-xl font-bold mb-4">Administrador</h2>
            <nav className="space-y-2">
            <Link className="block hover:underline" href="/adminDashboard"> Inicio </Link>
            <Link className="block hover:underline" href="/adminDashboard/reservas"> Reservas </Link>
            <Link className="block hover:underline" href="/adminDashboard/clientes"> Clientes </Link>
            <Link className="block hover:underline" href="/adminDashboard/historial-ventas"> Historial de Ventas </Link>
            <Link className="block hover:underline" href="/adminDashboard/recordatorios"> Recordatorios </Link>
            <Link className="block hover:underline" href="/adminDashboard/canchas"> Canchas </Link>
            <Link className="block hover:underline" href="/adminDashboard/equipamiento"> Equipamiento </Link>
            <Link className="block hover:underline" href="/adminDashboard/estadisticas"> Estadisticas </Link>
            </nav>
        </aside>

        <main className="flex-1 p-6 bg-gray-50">{children}</main>
        </div>
  );
}