/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testMatch: ["**/__tests__/**/*.test.ts", "**/?(*.)+(spec|test).ts"],
  roots: ["<rootDir>/src"],
  modulePaths: ["<rootDir>/src"],
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1",
    "@controller/(.*)": "<rootDir>/src/controller/$1",
    "@config/(.*)": "<rootDir>/src/config/$1",
    "@utils/(.*)": "<rootDir>/src/utils/$1",
    "@schema/(.*)": "<rootDir>/src/schema/$1",
    "@routes/(.*)": "<rootDir>/src/routes/$1",
    "@middleware/(.*)": "<rootDir>/src/middleware/$1",
  },
};
