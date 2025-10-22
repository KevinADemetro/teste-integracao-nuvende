export const authService = {
  login: async (clientId: string, clientSecret: string) => {
    try {
      const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
      const scopes = ["cob.write", "cob.read"];
      const body = new URLSearchParams({
        grant_type: "client_credentials",
        scope: scopes.join(" "),
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

    return response.json(); // Retorna dados do usuário
  },
};
