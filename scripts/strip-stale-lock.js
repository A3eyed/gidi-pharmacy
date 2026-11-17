/**
 * Runs on EAS before `yarn install --immutable`.
 * Removes RevenueCat / react-native-purchases entries that were deleted from package.json
 * so the lockfile matches manifests and immutable install succeeds.
 */
const fs = require("fs");
const path = require("path");

const lockPath = path.join(__dirname, "..", "yarn.lock");
if (!fs.existsSync(lockPath)) {
  console.log("[strip-stale-lock] no yarn.lock, skip");
  process.exit(0);
}

let text = fs.readFileSync(lockPath, "utf8");
const before = text.length;

text = text.replace(/^    react-native-purchases: "npm:9\.6\.1"\n/gm, "");
text = text.replace(/^    react-native-purchases-ui: "npm:9\.6\.1"\n/gm, "");

const stanza =
  /^"(?:@revenuecat\/[^\"]+|react-native-purchases(?:-ui)?)@[^\"]+":\n(?:  .*\n)*/gm;
text = text.replace(stanza, "");

text = text.replace(/\n{3,}/g, "\n\n");

if (text.length !== before) {
  fs.writeFileSync(lockPath, text);
  console.log(
    `[strip-stale-lock] cleaned yarn.lock (${before} -> ${text.length} bytes)`
  );
} else {
  console.log("[strip-stale-lock] yarn.lock already clean");
}
