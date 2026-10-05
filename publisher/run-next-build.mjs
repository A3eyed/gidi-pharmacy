import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

function getBuildScript() {
  try {
    const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));
    return typeof packageJson.scripts?.build === 'string' ? packageJson.scripts.build : '';
  } catch (_error) {
    // Missing or unreadable package.json: treat as no build script.
    return '';
  }
}

// Walk cwd -> parents for node_modules/next so monorepo hoists resolve.
// Returns the installed major, or null when next is not installed / unreadable.
function getInstalledNextMajorVersion() {
  let dir = process.cwd();
  for (;;) {
    try {
      const raw = readFileSync(join(dir, 'node_modules', 'next', 'package.json'), 'utf8');
      const version = JSON.parse(raw).version;
      if (typeof version === 'string') {
        const major = Number.parseInt(version.split('.')[0] ?? '', 10);
        if (Number.isFinite(major)) {
          return major;
        }
      }
    } catch (_error) {
      // next not installed at this level; keep walking parents.
    }
    const parent = dirname(dir);
    if (parent === dir) {
      break;
    }
    dir = parent;
  }
  return null;
}

const buildScript = getBuildScript();
// Published builds must use a deterministic bundler: OpenNext's output tracing
// is validated against a known bundler's build structure, so a plain
// `next build` (which would let Next.js pick) gets an explicit flag. Webpack is
// the long-standing default; the worker can switch a publish to Turbopack via
// the v2-publish-turbopack-enabled LD flag, which it forwards to this script as
// ANYTHING_PUBLISH_BUNDLER. Build scripts that already pin a bundler win.
//
// Match `next build` but not hyphenated CLIs like `open-next build` (the old
// `\bnext\s+build\b` false-positive matched the `next build` suffix inside
// `open-next build`).
const isPlainNextBuild =
  /(?:^|[\s;&|])next\s+build\b/.test(buildScript) &&
  !/\s--(?:webpack|turbopack)(?:\s|$)/.test(buildScript);
// `--webpack` / `--turbopack` only exist on the Next.js `build` CLI from 16+
// (vercel/next.js#84216). On Next 15.x plain `next build` already uses webpack;
// forcing the flag makes commander exit with `unknown option '--webpack'`
// (Quitno Immigration, Next 15.1.6, conv 215474751535220). When next is not
// installed yet we skip the flag rather than break pre-16 apps.
const nextMajor = getInstalledNextMajorVersion();
const supportsBundlerCliFlag = nextMajor !== null && nextMajor >= 16;
const forcedBundlerFlag =
  process.env.ANYTHING_PUBLISH_BUNDLER === 'turbopack' ? '--turbopack' : '--webpack';
const args = isPlainNextBuild && supportsBundlerCliFlag ? ['build', forcedBundlerFlag] : ['build'];

const result = spawnSync('yarn', args, {
  stdio: 'inherit',
});

if (result.error) {
  console.error(result.error);
  process.exit(1);
}

if (result.signal) {
  console.error(`Build command terminated by ${result.signal}`);
  process.exit(1);
}

process.exit(result.status ?? 1);
