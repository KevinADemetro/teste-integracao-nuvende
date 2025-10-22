import { authService } from "@/app/services/authService";
import { cobService } from "@/app/services/cobService";
import crypto from "crypto";

jest.setTimeout(20000);

describe("cobService - integração real", () => {
  let token: string;
  const accountId = process.env.ACCOUNT_ID!;
  const clientId = process.env.CLIENT_ID!;
  const clientSecret = process.env.CLIENT_SECRET!;

  beforeAll(async () => {
    const authResult = await authService.login(clientId, clientSecret);
    token = authResult.access_token;
    console.log("Token obtido:", token);
  });

  it("deve criar uma cobrança PIX real", async () => {
    const txid = crypto.randomUUID();

    const cobData = {
      chave: "59ba4ca7-e1d4-433f-8dbf-77e692434a69",
      solicitacaoPagador: "Pagamento pedido #1234 - Compra demo",
      nomeRecebedor: "Empresa Demo LTDA",
      valor: "10.01",
      devedorNome: "Cliente Teste",
      devedorCpf: "40352056053",
    };

    const result = await cobService.createCob(txid, token, accountId, cobData);

    console.log("Resposta da cobrança:", result);

    expect(result).toHaveProperty("txid");
    expect(result.txid).toBe(txid);
    expect(result).toHaveProperty("status");
  });
});
