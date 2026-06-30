import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

/**
 * Loads .env.local then .env into process.env for validation scripts.
 * Does not override variables already set in the environment.
 */
export function loadEnv(): void {
  const root = resolve(__dirname, "..");

  for (const filename of [".env.local", ".env"]) {
    const filepath = resolve(root, filename);
    if (!existsSync(filepath)) continue;

    const contents = readFileSync(filepath, "utf-8");
    for (const line of contents.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      const eqIndex = trimmed.indexOf("=");
      if (eqIndex === -1) continue;

      const key = trimmed.slice(0, eqIndex).trim();
      const value = trimmed.slice(eqIndex + 1).trim().replace(/^["']|["']$/g, "");

      if (!(key in process.env)) {
        process.env[key] = value;
      }
    }
  }
}
