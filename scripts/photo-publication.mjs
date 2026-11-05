import { readFileSync } from 'node:fs';

/** A reviewed photo source and its right to publish are separate facts. */
export function assertPhotoPublication(env, registry, warn = console.warn) {
  if (env.CF_PAGES !== '1') return;
  const pending = registry.filter((photo) => photo.reuse_authorization !== 'documented');
  if (pending.length)
    warn(
      'Photo rights notice: documented reuse/edit authorization remains pending. ' +
        'The owner requested publication; this does not establish a license. Models: ' +
        pending.map((photo) => photo.model).join(', '),
    );
}

export function checkPhotoPublication(env = process.env) {
  const registry = JSON.parse(
    readFileSync(new URL('../docs/PRODUCT-PHOTO-REGISTRY.json', import.meta.url), 'utf8'),
  );
  assertPhotoPublication(env, registry);
}
