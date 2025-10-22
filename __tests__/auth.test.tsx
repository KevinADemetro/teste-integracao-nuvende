import "@testing-library/jest-dom";
import { authService } from "@/app/services/authService";

describe("authService - integração real", () => {
  let token = "";

  it("deve autenticar e retornar access_token real", async () => {
    const clientId = process.env.CLIENT_ID ?? "";
    const clientSecret = process.env.CLIENT_SECRET ?? "";

    const result = await authService.login(clientId, clientSecret);

    expect(result).toHaveProperty("access_token");

    token = result.access_token;
    console.log("Token obtido:", token);
  });

  it("deve validar token real", async () => {
    if (!token) throw new Error("Token não obtido no teste anterior");

    const user = await authService.validateToken(token);
    expect(user).toHaveProperty("client_id");
    console.log("Usuário validado:", user);
  });
});
