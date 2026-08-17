/**
 * Seed 15 beginner / 15 intermediate / 15 expert questions for each core category.
 *
 *   node scripts/seed-core-category-questions.js
 *   node scripts/seed-core-category-questions.js --refresh-images
 *   node scripts/seed-core-category-questions.js fundamentals dsa
 */
const { seedCategoryPack } = require("./lib/seedCategoryPack");

const PACKS = {
  fundamentals: () => require("./packs/categories/fundamentals"),
  oop: () => require("./packs/categories/oop"),
  dsa: () => require("./packs/categories/dsa"),
  database: () => require("./packs/categories/database"),
  web: () => require("./packs/categories/web"),
  frameworks: () => require("./packs/categories/frameworks"),
  systemdesign: () => require("./packs/categories/system-design"),
  cloud: () => require("./packs/categories/cloud"),
  testing: () => require("./packs/categories/testing"),
  security: () => require("./packs/categories/security"),
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
    await seedCategoryPack(pack, { refreshImages });
  }

  console.log("\nAll requested category packs processed.");
  process.exit(0);
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { PACKS };
