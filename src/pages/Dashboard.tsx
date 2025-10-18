import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

interface SummaryData {
  ingresos: number;
  gastos: number;
  deuda_total: number;
  fondo_paz: number;
}

export default function Dashboard() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [summary, setSummary] = useState<SummaryData>({
    ingresos: 0,
    gastos: 0,
    deuda_total: 0,
    fondo_paz: 0,
  });

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setUserEmail(data.session.user.email);
      }
    });

    // Cargar datos simulados o desde Supabase
    // En tu versión final, aquí se hace el fetch desde la tabla de finanzas
    setSummary({
      ingresos: 3500,
      gastos: 2100,
      deuda_total: 14500,
      fondo_paz: 600,
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-700 text-white flex flex-col">
        <div className="p-6 text-center text-2xl font-semibold border-b border-blue-500">
          Paz Financiera 🌿
        </div>
        <nav className="flex-1 p-4 space-y-3">
          <button className="block w-full text-left py-2 px-3 rounded hover:bg-blue-600">
            Radiografía Financiera
          </button>
          <button className="block w-full text-left py-2 px-3 rounded hover:bg-blue-600">
            Plan de Cancelación
          </button>
          <button className="block w-full text-left py-2 px-3 rounded hover:bg-blue-600">
            Fondo de Paz
          </button>
          <button className="block w-full text-left py-2 px-3 rounded hover:bg-blue-600">
            Seguimiento Mensual
          </button>
        </nav>
        <button
          onClick={handleLogout}
          className="m-4 bg-red-500 hover:bg-red-600 py-2 rounded text-sm"
        >
          Cerrar sesión
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-semibold text-gray-700 mb-2">
          Bienvenido, {userEmail || "Usuario"}
        </h1>
        <p className="text-gray-500 mb-6">
          Este es tu panel financiero. Aquí verás tu progreso y tus metas.
        </p>

        {/* Resumen */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-4 rounded-xl shadow text-center">
            <h2 className="text-gray-500">Ingresos</h2>
            <p className="text-2xl font-bold text-green-600">
              ${summary.ingresos.toLocaleString()}
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow text-center">
            <h2 className="text-gray-500">Gastos</h2>
            <p className="text-2xl font-bold text-red-500">
              ${summary.gastos.toLocaleString()}
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow text-center">
            <h2 className="text-gray-500">Deuda Total</h2>
            <p className="text-2xl font-bold text-orange-500">
              ${summary.deuda_total.toLocaleString()}
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow text-center">
            <h2 className="text-gray-500">Fondo de Paz</h2>
            <p className="text-2xl font-bold text-blue-600">
              ${summary.fondo_paz.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Sección inferior */}
        <div className="mt-10 bg-white p-6 rounded-xl shadow">
          <h3 className="text-xl font-semibold text-gray-700 mb-3">
            Próximos pasos
          </h3>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Actualiza tus datos financieros mensuales.</li>
            <li>Revisa tu plan de cancelación de deudas.</li>
            <li>Evalúa el avance de tu Fondo de Paz Financiera.</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
