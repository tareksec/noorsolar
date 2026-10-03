/**
 * scripts/check-build-config.js
 * Regression guard for Hostinger production builds (see DEPLOY.md):
 * 1. Node.js is pinned to major 20 (engines, .nvmrc, .node-version, .tool-versions).
 *    Build worker crashes were observed on Node 22; production builds run on Node 20.x.
 * 2. The production build opts out of Turbopack via `next build --webpack`.
 *    Next.js 16 uses Turbopack by default and `--webpack` is the documented
 *    opt-out (there is no config/env toggle).
 *
 * Exit code 1 on any failure.
 */

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const failures = [];

function check(name, ok, detail) {
  if (ok) {
    console.log(`  ✓ ${name}`);
  } else {
    failures.push(name);
    console.error(`  ✗ ${name}: ${detail}`);
  }
}

function readFile(rel) {
  return fs.readFileSync(path.join(root, rel), "utf-8").trim();
}

console.log("▶ Verifying build configuration (Node pin + webpack opt-out)...");

const pkg = JSON.parse(readFile("package.json"));

// 1. Node 20 pins
const enginesNode = (pkg.engines && pkg.engines.node) || "";
check("package.json engines.node targets Node 20", /^20(\.|x|$)/.test(enginesNode), `found "${enginesNode}"`);

for (const file of [".nvmrc", ".node-version"]) {
  const value = readFile(file);
  check(`${file} pins Node 20`, /^20(\.|x|$)/.test(value), `found "${value}"`);
}

const toolVersions = readFile(".tool-versions");
const toolNode = (toolVersions.match(/^nodejs\s+(\S+)/m) || [])[1] || "";
check(".tool-versions pins Node 20", toolNode.startsWith("20"), `found "${toolNode || toolVersions}"`);

// 2. Webpack build opt-out
const buildScript = (pkg.scripts && pkg.scripts.build) || "";
check(
  'build script uses "next build --webpack"',
  /(^|\s)next build --webpack(\s|$)/.test(buildScript),
  `found "${buildScript}"`
);

if (failures.length > 0) {
  console.error(`\n❌ BUILD CONFIG CHECK FAILED (${failures.length}): ${failures.join("; ")}`);
  process.exit(1);
}

console.log("\n🎉 BUILD CONFIG CHECK PASSED");
