"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("/controllers/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId, clientSecret }),
      });

      if (!response.ok) {
        throw new Error("Credenciais inválidas");
      }
      const data = await response.json();
      localStorage.setItem("nuvende_token", data.access_token);
      setSuccess("Login realizado com sucesso!");
      router.push("/pix");
    } catch (err: any) {
      setError(err.message || "Erro na autenticação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm bg-white shadow-lg rounded-2xl p-6 sm:p-8">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Login com Client Credentials
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Client ID</label>
            <input
              type="text"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
              placeholder="Digite seu Client ID"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Client Secret
            </label>
            <input
              type="password"
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
              placeholder="Digite seu Client Secret"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Enviando..." : "Enviar"}
          </button>

          {error && <p className="text-red-500 text-center text-sm">{error}</p>}
          {success && <p className="text-green-600 text-center text-sm">{success}</p>}
        </form>
      </div>
    </div>
  );
}
