import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "node", // ✅ importante para testar serviços
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"], // ✅ inclui o fetch global
};

export default createJestConfig(config);
