import { defineConfig } from "eslint/config";
import next from "eslint-config-next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(process.env.ERRATA_URL || import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig([{
    extends: [...next],
    rules: {
        "react/no-unescaped-entities": "off",
        "@next/next/no-img-element": "warn",
        "react-hooks/set-state-in-effect": "off",
        "react-hooks/purity": "off",
    },
}]);
