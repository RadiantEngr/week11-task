export default {
  roots: ["<rootDir>/dist"],
  testMatch: [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)",
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  preset: "@shelf/jest-mongodb",
  testEnvironment: "node",
};
