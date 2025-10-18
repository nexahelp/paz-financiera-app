import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Radiografia() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    ingresos: "",
    gastos: "",
    deudas: "",
    fondo_paz: "",
    observaciones: "",
  });
  const [success, setSuccess] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserId(data.user.id);
        fetchExistingData(data.user.id);
      }
    });
  }, []);

  const fetchExistingData = async (uid: string) => {
    const { data } = await supabase
      .from("radiografias")
      .select("*")
      .eq("user_id", uid)
      .maybeSingle();

    if (data) {
      setFormData({
        ingresos: data.ingresos || "",
        gastos: data.gastos || "",
        deudas: data.deudas || "",
        fondo_paz: data.fondo_paz || "",
        observaciones: data.observaciones || "",
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId) return;
    setLoading(true);
    setSuccess(null);

    const { error } = await supabase.from("radiografias").upsert({
      user_id: userId,
      ingresos: Number(formData.ingresos),
      gastos: Number(formData.gastos),
      deudas: Number(formData.deudas),
      fondo_paz: Number(formData.fondo_paz),
      observaciones: formData.observaciones,
    });

    if (error) {
      console.error(error);
      setSuccess("❌ Error al guardar la radiografía.");
    } else {
      setSuccess("✅ Radiografía guardada exitosamente.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-2xl">
        <h1 className="text-3xl font-semibold text-gray-700 mb-6 text-center">
          Radiografía Financiera 🧾
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Ingresos Mensuales
            </label>
            <input
              type="number"
              name="ingresos"
              value={formData.ingresos}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Gastos Mensuales
            </label>
            <input
              type="number"
              name="gastos"
              value={formData.gastos}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Deudas Totales
            </label>
            <input
              type="number"
              name="deudas"
              value={formData.deudas}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Fondo de Paz Financiera
            </label>
            <input
              type="number"
              name="fondo_paz"
              value={formData.fondo_paz}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Observaciones
            </label>
            <textarea
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white font-semibold rounded-lg ${
              loading
                ? "bg-brand-600/60"
                : "bg-brand-700 hover:bg-brand-600 transition-colors"
            }`}
          >
            {loading ? "Guardando..." : "Guardar Radiografía"}
          </button>
        </form>

        {success && (
          <p
            className={`mt-4 text-center font-medium ${
              success.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {success}
          </p>
        )}
      </div>
    </div>
  );
}
