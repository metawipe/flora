const fs = require("fs");
const path = require("path");
const m = require("../src/data/mock.json");
const all = [
  ...m.bouquets,
  ...m.plants,
  ...m.vip,
  ...m.boxes,
  ...m.baskets,
];
const ids = new Set(all.map((p) => p.id));
const src = fs.readFileSync(
  path.join(__dirname, "../src/i18n/productNames.ts"),
  "utf8",
);
const re =
  /  "([^"]+)": \{\n    uz: ("(?:\\.|[^"])*"),\n    en: ("(?:\\.|[^"])*"),\n  },/g;
const kept = [];
let match;
while ((match = re.exec(src))) {
  if (ids.has(match[1])) {
    kept.push(
      `  ${JSON.stringify(match[1])}: {\n    uz: ${match[2]},\n    en: ${match[3]},\n  },`,
    );
  }
}
const missing = [...ids].filter(
  (id) => !kept.some((row) => row.includes(JSON.stringify(id))),
);
if (missing.length) {
  console.error("Missing translations for:", missing);
  process.exit(1);
}
const out = `import type { Locale } from "./config";

export const productNames: Record<
  string,
  Record<Exclude<Locale, "ru">, string>
> = {
${kept.join("\n")}
};

export function productName(
  id: string,
  locale: Locale,
  fallback: string,
): string {
  if (locale === "ru") return fallback;
  return productNames[id]?.[locale] ?? fallback;
}
`;
fs.writeFileSync(path.join(__dirname, "../src/i18n/productNames.ts"), out);
console.log("kept", kept.length);
