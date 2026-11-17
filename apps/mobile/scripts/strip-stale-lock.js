const fs = require("fs");
const path = require("path");

function findLock(start) {
  let dir = path.resolve(start);
  for (let i = 0; i < 8; i++) {
    const candidate = path.join(dir, "yarn.lock");
    if (fs.existsSync(candidate)) return candidate;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

const starts = [process.cwd(), __dirname, path.join(process.cwd(), ".."), path.join(process.cwd(), "../..")];
let lockPath = null;
for (const s of starts) {
  lockPath = findLock(s);
  if (lockPath) break;
}

console.log("[strip-stale-lock] cwd=", process.cwd(), "lock=", lockPath);

if (!lockPath) {
  console.log("[strip-stale-lock] yarn.lock not found — listing cwd");
  try { console.log(fs.readdirSync(process.cwd()).join(", ")); } catch (e) {}
  process.exit(0);
}

let text = fs.readFileSync(lockPath, "utf8");
const before = text.length;

const patterns = [
  /^    react-native-purchases: "npm:[^"]+"\n/gm,
  /^    react-native-purchases-ui: "npm:[^"]+"\n/gm,
  /^"@revenuecat\/[^\"]+@[^\"]+":\n(?:  .*\n)*/gm,
  /^"react-native-purchases(?:-ui)?@[^\"]+":\n(?:  .*\n)*/gm,
];
for (const p of patterns) text = text.replace(p, "");
text = text.replace(/\n{3,}/g, "\n\n");

if (text.length !== before) {
  fs.writeFileSync(lockPath, text);
  console.log(`[strip-stale-lock] cleaned ${lockPath} (${before} -> ${text.length})`);
} else {
  console.log("[strip-stale-lock] already clean:", lockPath);
}

const yarnrcCandidates = [
  path.join(path.dirname(lockPath), ".yarnrc.yml"),
  path.join(process.cwd(), ".yarnrc.yml"),
];
for (const yarnrc of yarnrcCandidates) {
  try {
    let y = fs.existsSync(yarnrc) ? fs.readFileSync(yarnrc, "utf8") : "";
    if (!/enableImmutableInstalls/.test(y)) {
      y = (y ? y + "\n" : "") + "enableImmutableInstalls: false\n";
      fs.writeFileSync(yarnrc, y);
      console.log("[strip-stale-lock] wrote enableImmutableInstalls:false to", yarnrc);
    }
  } catch (e) {
    console.log("[strip-stale-lock] yarnrc skip", yarnrc, e.message);
  }
}
