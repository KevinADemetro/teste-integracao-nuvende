export const authService = {
  login: async (clientId: string, clientSecret: string) => {
    try {
      const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
      const body = new URLSearchParams({
        grant_type: "client_credentials",
        scope:
          "kyc.background-check.natural-person kyc.background-check.legal-person cob.write cob.read webhooks.read webhooks.write merchants.read merchants.write terminals.read terminals.write transactions.read transactions.write",
      });

      const response = await fetch("https://api-h.nuvende.com.br/api/v2/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${credentials}`,
        },
        body: body.toString(),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Falha na autenticação");
      }
      return response.json();
    } catch (err) {
      console.error("Erro no authService:", err);
      throw err;
    }
  },

  validateToken: async (token: string) => {
    const response = await fetch("https://api-h.nuvende.com.br/api/v2/auth/user", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Token inválido" }));
      throw new Error(error.message || "Token inválido");
    }

    return response.json();
  },
};
