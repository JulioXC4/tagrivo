import { readFileSync } from 'node:fs';

/** A reviewed photo source and its right to publish are separate facts. */
export function assertPhotoPublication(env, registry) {
  if (env.CF_PAGES !== '1') return;
  const pending = registry.filter((photo) => photo.reuse_authorization !== 'documented');
  if (pending.length)
    throw new Error(
      'Product-photo publication is pending documented reuse/edit authorization. ' +
        'Local preview is available; do not deploy these pending compositions. Models: ' +
        pending.map((photo) => photo.model).join(', '),
    );
}

export function checkPhotoPublication(env = process.env) {
  const registry = JSON.parse(
    readFileSync(new URL('../docs/PRODUCT-PHOTO-REGISTRY.json', import.meta.url), 'utf8'),
  );
  assertPhotoPublication(env, registry);
}
