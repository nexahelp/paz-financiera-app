
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: window.location.origin }
      });
      if (error) throw error;
      setMessage("✅ Revisa tu correo para el enlace mágico de acceso.");
    } catch (err: any) {
      setMessage(`❌ Error al iniciar sesión: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-semibold text-gray-700 mb-4">
          Bienvenido a <span className="text-blue-600">Paz Financiera</span>
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Ingresa tu correo electrónico para acceder a tu cuenta
        </p>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" name="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          <button type="submit" disabled={loading} className={`w-full py-2 rounded-lg text-white font-semibold ${loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 transition-colors"}`}>
            {loading ? "Enviando enlace..." : "Enviar enlace mágico"}
          </button>
        </form>
        {message && (<p className={`mt-4 text-sm font-medium ${message.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>{message}</p>)}
      </div>
      <p className="mt-6 text-xs text-gray-400">© {new Date().getFullYear()} Paz Financiera · Coach Ana Karina Fontecha</p>
    </div>
  );
}
