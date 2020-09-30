export default {
  roots: ["<rootDir>"],
  testMatch: [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)",
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  preset: "@shelf/jest-mongodb",
  testEnvironment: "node",
  setupFilesAfterEnv:['./jest.setup.js']
};
