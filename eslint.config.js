import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
    {
        rules: {
            "no-unused-vars": 2,
            "max-len": [1, 120],
            "max-params": [2, 3],
        },
    },
    { ignores: ["./assets"] },
    { ignorePatterns: ["assets"] },
    { files: ["**/*.{js,mjs,cjs,ts}"] },
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
];
