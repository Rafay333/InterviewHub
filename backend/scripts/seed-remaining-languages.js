/**
 * Seed remaining languages — 15 beginner / 15 intermediate / 15 expert each.
 * Pictures use varied Full HD layouts (steps, cycle, layers, code, timeline, hub, compare).
 *
 *   node scripts/seed-remaining-languages.js
 *   node scripts/seed-remaining-languages.js --refresh-images
 *   node scripts/seed-remaining-languages.js typescript java
 */
const { seedLanguagePack } = require("./lib/seedLanguagePack");

const PACKS = {
  typescript: () => require("./packs/typescript"),
  java: () => require("./packs/java"),
  cpp: () => require("./packs/cpp"),
  csharp: () => require("./packs/csharp"),
  rust: () => require("./packs/rust"),
  php: () => require("./packs/php"),
  ruby: () => require("./packs/ruby"),
  swift: () => require("./packs/swift"),
  kotlin: () => require("./packs/kotlin"),
  dart: () => require("./packs/dart"),
  r: () => require("./packs/r"),
  scala: () => require("./packs/scala"),
  lua: () => require("./packs/lua"),
  matlab: () => require("./packs/matlab"),
};

function validatePack(pack, key) {
  const levels = ["beginner", "intermediate", "expert"];
  const kinds = new Set(["steps", "cycle", "layers", "code", "timeline", "hub", "compare"]);
  for (const level of levels) {
    const items = pack[level];
    if (!Array.isArray(items) || items.length !== 15) {
      throw new Error(`${key} ${level} has ${items && items.length} items, expected 15`);
    }
    for (const [i, it] of items.entries()) {
      if (!it.q || !it.a || !it.e || !it.visual || !it.visual.kind || !it.visual.title) {
        throw new Error(`${key} ${level}[${i}] missing q/a/e/visual`);
      }
      if (!kinds.has(it.visual.kind)) {
        throw new Error(`${key} ${level}[${i}] bad kind ${it.visual.kind}`);
      }
    }
  }
}

async function main() {
  const args = process.argv.slice(2).filter((a) => a !== "--refresh-images");
  const refreshImages = process.argv.includes("--refresh-images");
  const keys = args.length ? args : Object.keys(PACKS);

  for (const key of keys) {
    const load = PACKS[key];
    if (!load) {
      console.error("Unknown pack:", key, "known:", Object.keys(PACKS).join(", "));
      process.exit(1);
    }
    const pack = load();
    validatePack(pack, key);
    console.log("\n==========", pack.name, "==========");
    await seedLanguagePack(pack, { refreshImages });
  }

  console.log("\nAll requested language packs processed.");
  process.exit(0);
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { PACKS };
