
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { motion } from "framer-motion";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserEmail(data.user.email);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const menuItems = [
    { name: "Radiografía Financiera", path: "/radiografia" },
    { name: "Plan de Cancelación", path: "/plan-cancelacion" },
    { name: "Fondo de Paz", path: "/fondo-paz" },
    { name: "Seguimiento Mensual", path: "/seguimiento" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-brand-700 text-white flex flex-col">
        <div className="p-6 text-center text-2xl font-semibold border-b border-brand-700/40">
          Paz Financiera 🌿
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`block w-full text-left py-2 px-3 rounded transition-colors ${location.pathname === item.path ? "bg-brand-600 font-semibold" : "hover:bg-brand-600"}`}
            >
              {item.name}
            </button>
          ))}
        </nav>
        <button onClick={handleLogout} className="m-4 bg-red-500 hover:bg-red-600 py-2 rounded text-sm transition">
          Cerrar sesión
        </button>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <h1 className="text-sm sm:text-base font-semibold text-gray-700">Coach Ana Karina Fontecha</h1>
          <a href="mailto:nexahelp@outloook.com" className="text-sm bg-brand-600 text-white px-3 py-1.5 rounded hover:bg-brand-700">
            Soporte
          </a>
        </header>

        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="p-8"
        >
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold text-gray-700 mb-1">Bienvenida/o, {userEmail || "Usuario"}</h2>
            <p className="text-gray-500">Selecciona una sección del menú para comenzar.</p>
          </div>
        </motion.main>
      </div>
    </div>
  );
}
