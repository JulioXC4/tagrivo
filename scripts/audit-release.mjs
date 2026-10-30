import { execFileSync } from 'node:child_process';
import { readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';

if (existsSync('.env')) loadEnvFile('.env');
const privateLegalValues = [
  'LEGAL_OPERATOR_NAME',
  'LEGAL_OPERATOR_DOCUMENT',
  'LEGAL_OPERATOR_ADDRESS',
]
  .map((key) => process.env[key]?.trim())
  .filter(Boolean);

// Inspect exactly the files eligible for Git publication, never print matching secrets.
const files = execFileSync(
  'git',
  ['ls-files', '--cached', '--others', '--exclude-standard', '-z'],
  { encoding: 'utf8' },
)
  .split('\0')
  .filter(Boolean);
const failures = [];
const sensitiveName =
  /(^|\/)(?:\.env(?:\..*)?|\.dev\.vars(?:\..*)?|id_rsa|id_ed25519|credentials(?:\.json)?|[^/]+\.(?:pem|key|p12|pfx))$/i;
const secrets = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /\bgh[pousr]_[A-Za-z0-9]{30,}\b/,
  /\bgithub_pat_[A-Za-z0-9_]{30,}\b/,
  /\bAKIA[0-9A-Z]{16}\b/,
  /https?:\/\/[^\s/:]+:[^\s/@]+@/,
];
for (const file of new Set(files)) {
  if (file === '.env.example') continue;
  if (
    sensitiveName.test(file) ||
    /^(?:node_modules|dist|\.astro|\.wrangler|release-artifacts|\.impeccable\/review)\//.test(file)
  ) {
    failures.push(`${file}: private/generated file eligible for Git`);
    continue;
  }
  const info = await stat(file);
  if (!info.isFile() || info.size > 5_000_000 || /\.(png|jpe?g|webp|woff2?|ico|pdf)$/i.test(file))
    continue;
  const content = await readFile(file, 'utf8');
  if (privateLegalValues.some((value) => content.includes(value)))
    failures.push(`${file}: legal personal data must remain in private build variables, not Git`);
  if (secrets.some((pattern) => pattern.test(content)))
    failures.push(`${file}: possible embedded credential`);
  if (/[A-Z]:\/(?:Users|Julio)\/[A-Za-z0-9_.-]+\//i.test(content.replaceAll('\\', '/')))
    failures.push(`${file}: personal local path`);
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(
  `Release audit: ${new Set(files).size} Git-eligible files checked; no configured credential patterns or private file names found. This is a bounded scan, not a secret-management guarantee.`,
);
