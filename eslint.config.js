import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
    { ignores: ["./assets"] },
    { files: ["**/*.{js,mjs,cjs,ts}"] },
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        rules: {
            "no-unused-vars": 2,
            "max-len": [1, 140],
            "max-params": [2, 3],
            "no-shadow" : 0,
            '@typescript-eslint/no-unsafe-function-type': 0,
            '@typescript-eslint/no-explicit-any': 0,
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": ["error"]
        },
    },
];
