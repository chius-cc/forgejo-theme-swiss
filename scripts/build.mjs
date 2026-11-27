#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');

const FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Google+Sans+Code:wght@400;500;700&display=swap');\n\n";

const LIGHT_HEADER = `/*!
 * Swiss Light (Paper) — Paper Monospace Swiss Theme for Forgejo 17.x
 * Aesthetic: Warm paper (#fdfcfb), slate blue (#256786), brick mark (#b24c37)
 * License: MIT (https://github.com/chius-cc/forgejo-theme-swiss)
 */\n\n`;

const DARK_HEADER = `/*!
 * Swiss Dark (Slate) — Paper Monospace Swiss Theme for Forgejo 17.x
 * Aesthetic: Slate night (#202530), warm apricot (#eab38b), light mist (#e1e5ed)
 * License: MIT (https://github.com/chius-cc/forgejo-theme-swiss)
 */\n\n`;

const AUTO_CONTENT = `/*!
 * Swiss Auto — Paper Monospace Swiss Theme for Forgejo 17.x
 * Automatically switches between Swiss Light and Swiss Dark via prefers-color-scheme.
 * Requires theme-swiss-light.css and theme-swiss-dark.css in the same directory.
 */
@import "./theme-swiss-light.css";
@import "./theme-swiss-dark.css" (prefers-color-scheme: dark);
`;

const lightTokens = fs.readFileSync(path.join(srcDir, 'tokens-light.css'), 'utf8');
const darkTokens = fs.readFileSync(path.join(srcDir, 'tokens-dark.css'), 'utf8');
const coreCss = fs.readFileSync(path.join(srcDir, 'swiss-core.css'), 'utf8');

function extractCustomProps(css) {
  const props = new Set();
  const rootMatch = css.match(/:root\s*\{([\s\S]*?)\}/);
  if (!rootMatch) return props;
  for (const m of rootMatch[1].matchAll(/(--[a-zA-Z0-9_-]+)\s*:/g)) {
    props.add(m[1]);
  }
  return props;
}

const lightProps = extractCustomProps(lightTokens);
const darkProps = extractCustomProps(darkTokens);

const darkAllowedExtra = new Set([
  '--is-dark-theme',
  '--thin-lightness-highlight',
  '--color-thin-red-highlight',
  '--bg-lightness',
  '--bg-chroma',
  '--color-danger-bg',
  '--color-pure-black',
]);

const missingInDark = [...lightProps].filter((p) => !darkProps.has(p));
const missingInLight = [...darkProps].filter((p) => !lightProps.has(p) && !darkAllowedExtra.has(p));

if (missingInDark.length || missingInLight.length) {
  console.error('Token parity check failed:');
  if (missingInDark.length) console.error('  Missing in tokens-dark.css:', missingInDark);
  if (missingInLight.length) console.error('  Missing in tokens-light.css:', missingInLight);
  process.exit(1);
}

fs.writeFileSync(
  path.join(rootDir, 'theme-swiss-light.css'),
  FONT_IMPORT + LIGHT_HEADER + lightTokens.trimEnd() + '\n\n' + coreCss.trimEnd() + '\n',
  'utf8',
);

fs.writeFileSync(
  path.join(rootDir, 'theme-swiss-dark.css'),
  FONT_IMPORT + DARK_HEADER + darkTokens.trimEnd() + '\n\n' + coreCss.trimEnd() + '\n',
  'utf8',
);

fs.writeFileSync(path.join(rootDir, 'theme-swiss-auto.css'), AUTO_CONTENT, 'utf8');

console.log(
  `Built theme-swiss-light.css (${lightProps.size} tokens), theme-swiss-dark.css (${darkProps.size} tokens), and theme-swiss-auto.css.`,
);
