import { cpSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "assets");
const dest = join(root, "public", "assets");

if (!existsSync(src)) {
  console.warn("sync-assets: assets/ not found — skipping");
  process.exit(0);
}

mkdirSync(join(root, "public"), { recursive: true });
cpSync(src, dest, { recursive: true });
console.log("sync-assets: copied assets -> public/assets");
