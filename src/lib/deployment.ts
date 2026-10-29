export interface DeploymentEnvironment {
  PUBLIC_SITE_URL?: string;
  SITE_INDEXING?: string;
  CF_PAGES?: string;
  CF_PAGES_URL?: string;
  CF_PAGES_BRANCH?: string;
}

function origin(value: string, name: string): string {
  const url = new URL(value);
  if (
    !['http:', 'https:'].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.pathname !== '/' ||
    url.search ||
    url.hash
  )
    throw new Error(`${name} must be an HTTP(S) origin without a path, credentials or query.`);
  return url.origin;
}

/** Preview builds always stay non-indexable, even when production indexing is enabled. */
export function resolveDeployment(env: DeploymentEnvironment) {
  if (env.SITE_INDEXING && !['disabled', 'enabled'].includes(env.SITE_INDEXING))
    throw new Error('SITE_INDEXING must be disabled or enabled.');
  const pages = env.CF_PAGES === '1';
  const preview = pages && env.CF_PAGES_BRANCH !== 'main';
  const configured = env.PUBLIC_SITE_URL ? origin(env.PUBLIC_SITE_URL, 'PUBLIC_SITE_URL') : null;
  const generated = env.CF_PAGES_URL ? origin(env.CF_PAGES_URL, 'CF_PAGES_URL') : null;
  if (pages && !generated) throw new Error('Cloudflare must supply CF_PAGES_URL.');
  const site = (preview ? generated : configured || generated) || 'http://localhost:4321';
  const indexable = env.SITE_INDEXING === 'enabled' && !preview;
  if (pages && !site.startsWith('https://')) throw new Error('Public deployments require HTTPS.');
  if (indexable) {
    if (!configured) throw new Error('Indexing requires an explicitly confirmed PUBLIC_SITE_URL.');
    const host = new URL(site).hostname;
    if (
      !site.startsWith('https://') ||
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host.endsWith('.invalid') ||
      host.endsWith('.example') ||
      host === 'example.com'
    )
      throw new Error('Indexing requires a real HTTPS production origin.');
  }
  return { site, indexable, preview };
}
