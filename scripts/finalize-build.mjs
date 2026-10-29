import { readFile, writeFile } from 'node:fs/promises';
import { deployment } from './deployment-env.mjs';

const base = await readFile('public/_headers', 'utf8');
const indexing = deployment.indexable ? '' : '\n/*\n  X-Robots-Tag: noindex, nofollow\n';
await writeFile('dist/_headers', base.trimEnd() + '\n' + indexing);
console.log(
  `Deployment origin: ${deployment.site}; indexing: ${deployment.indexable ? 'enabled' : 'disabled'}.`,
);
