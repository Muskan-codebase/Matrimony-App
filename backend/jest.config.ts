import type { Config } from "jest";

const config: Config = {
    preset: "ts-jest",
    testEnvironment: "node",

    setupFilesAfterEnv: [
        "<rootDir>/tests/setup/mongodb.ts",
    ],

    testMatch: [
        "**/*.test.ts",
    ],

    clearMocks: true,
};

export default config;