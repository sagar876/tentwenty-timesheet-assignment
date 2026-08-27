import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  // tests/e2e holds Playwright specs, not Jest tests - keep Jest from
  // trying to load them.
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/tests/e2e/"],
  // Matches the "@/*" path in tsconfig.json - next/jest doesn't read
  // tsconfig paths on its own, so jest.mock() on an aliased specifier
  // can't resolve it without this.
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

export default createJestConfig(config);
