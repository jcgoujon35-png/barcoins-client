import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Apostrophes dans le JSX — non critique, texte français avec '
      "react/no-unescaped-entities": "off",
      // Variables préfixées _ sont intentionnellement inutilisées
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      // Deps hooks — warnings acceptables en dev
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];

export default eslintConfig;
