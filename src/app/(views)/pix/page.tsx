"use client";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { useAuthGuard } from "../../hooks/useAuthGuard";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function PixPage() {
  const [accountId, setAccountId] = useState("");
  const [chave, setChave] = useState("");
  const [solicitacaoPagador, setSolicitacaoPagador] = useState("");
  const [nomeRecebedor, setNomeRecebedor] = useState("");
  const [valor, setValor] = useState("");
  const [devedorNome, setDevedorNome] = useState("");
  const [devedorCpf, setDevedorCpf] = useState("");
  const [devedorCnpj, setDevedorCnpj] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("nuvende_token");
      if (!token) throw new Error("Usuário não autenticado");
      const txid = uuidv4();

      const response = await fetch("/controllers/cob", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          txid,
          accountId,
          token,
          cobData: {
            chave,
            solicitacaoPagador,
            nomeRecebedor,
            valor,
            devedorNome,
            devedorCpf: devedorCpf || undefined,
            devedorCnpj: devedorCnpj || undefined,
          },
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Erro ao criar cobrança");
      }

      const data = await response.json();
      setSuccess(`Cobrança criada com sucesso! TXID: ${txid}`);
      console.log("Cobrança criada:", data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadingAuth = useAuthGuard();
  if (loadingAuth) return <LoadingSpinner />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Criar Cobrança PIX</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            placeholder="Account ID"
            className="input"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            required
          />
          <input
            placeholder="Chave PIX"
            className="input"
            value={chave}
            onChange={(e) => setChave(e.target.value)}
            required
          />
          <input
            placeholder="Solicitação ao Pagador"
            className="input"
            value={solicitacaoPagador}
            onChange={(e) => setSolicitacaoPagador(e.target.value)}
          />
          <input
            placeholder="Nome Recebedor"
            className="input"
            value={nomeRecebedor}
            onChange={(e) => setNomeRecebedor(e.target.value)}
            required
          />
          <input
            placeholder="Valor (ex: 10.50)"
            className="input"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            required
          />
          <input
            placeholder="Nome do Devedor"
            className="input"
            value={devedorNome}
            onChange={(e) => setDevedorNome(e.target.value)}
            required
          />
          <input
            placeholder="CPF do Devedor"
            className="input"
            value={devedorCpf}
            onChange={(e) => setDevedorCpf(e.target.value)}
          />
          <input
            placeholder="CNPJ do Devedor"
            className="input"
            value={devedorCnpj}
            onChange={(e) => setDevedorCnpj(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Criando..." : "Criar Cobrança"}
          </button>

          {error && <p className="text-red-500 text-center">{error}</p>}
          {success && <p className="text-green-600 text-center">{success}</p>}
        </form>
      </div>
    </div>
  );
}
