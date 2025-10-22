export const cobService = {
  createCob: async (
    txid: string,
    token: string,
    accountId: string,
    data: {
      chave: string;
      solicitacaoPagador: string;
      nomeRecebedor: string;
      valor: string;
      devedorNome: string;
      devedorCpf?: string;
      devedorCnpj?: string;
    }
  ) => {
    try {
      const body = {
        chave: data.chave,
        solicitacaoPagador: data.solicitacaoPagador,
        nomeRecebedor: data.nomeRecebedor,
        calendario: { expiracao: "3600" },
        valor: { original: data.valor, modalidadeAlteracao: "1" },
        devedor: {
          nome: data.devedorNome,
          ...(data.devedorCpf && { cpf: data.devedorCpf }),
          ...(data.devedorCnpj && { cnpj: data.devedorCnpj }),
        },
      };
      const response = await fetch(
        `https://api-h.nuvende.com.br/api/v2/cobranca/cob/${txid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Account-Id": accountId,
          },
          body: JSON.stringify(body),
        }
      );
      const responseData = await response.json();
      console.log(responseData);

      if (!response.ok) {
        const err = await response.json().catch(() => ({ message: "Erro desconhecido" }));
        throw new Error(err.message || "Falha ao criar cobrança");
      }

      return response.json();
    } catch (err) {
      console.error("Erro no cobService:", err);
      throw err;
    }
  },
};
