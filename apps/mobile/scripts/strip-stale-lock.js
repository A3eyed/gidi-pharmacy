const fs = require("fs");
const path = require("path");

function findLock(start) {
  let dir = start;
  for (let i = 0; i < 6; i++) {
    const candidate = path.join(dir, "yarn.lock");
    if (fs.existsSync(candidate)) return candidate;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

const lockPath = findLock(process.cwd()) || findLock(__dirname);
if (!lockPath) {
  console.log("[strip-stale-lock] yarn.lock not found from", process.cwd());
  process.exit(0);
}

let text = fs.readFileSync(lockPath, "utf8");
const before = text.length;

text = text.replace(/^    react-native-purchases: "npm:9\.6\.1"\n/gm, "");
text = text.replace(/^    react-native-purchases-ui: "npm:9\.6\.1"\n/gm, "");
text = text.replace(
  /^"(?:@revenuecat\/[^\"]+|react-native-purchases(?:-ui)?)@[^\"]+":\n(?:  .*\n)*/gm,
  ""
);
text = text.replace(/\n{3,}/g, "\n\n");

if (text.length !== before) {
  fs.writeFileSync(lockPath, text);
  console.log(`[strip-stale-lock] cleaned ${lockPath} (${before} -> ${text.length})`);
} else {
  console.log("[strip-stale-lock] already clean:", lockPath);
}
