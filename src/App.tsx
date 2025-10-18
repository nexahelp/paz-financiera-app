
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

export default function App() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => { listener.subscription.unsubscribe(); };
  }, []);

  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    return <div className="p-10 text-center text-red-600">❌ Error: faltan variables de entorno de Supabase.</div>;
  }

  return session ? <Dashboard /> : <Login />;
}
