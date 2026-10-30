export interface AnalyticsConfig {
  enabled: boolean;
  measurementId: string | null;
}
export interface AnalyticsConsent {
  version: 1;
  choice: 'accepted' | 'rejected';
  expiresAt: number;
}
export const CONSENT_KEY = 'tagrivo-analytics-consent';
export const CONSENT_LIFETIME = 30 * 24 * 60 * 60 * 1000;

/** Signals carry an event name only, never tool answers, URLs or quote values. */
export function announceToolUse(name: 'printer_finder_complete' | 'comparison_used') {
  if (!['printer_finder_complete', 'comparison_used'].includes(name)) return;
  if (typeof document !== 'undefined') document.dispatchEvent(new Event(`tagrivo:${name}`));
}

/** A real destination, approved policy and reader consent are separate requirements. */
export function resolveAnalyticsConfig(env: {
  PUBLIC_ANALYTICS_ENABLED?: string;
  PUBLIC_ANALYTICS_POLICY_APPROVED?: string;
  PUBLIC_GA4_MEASUREMENT_ID?: string;
}): AnalyticsConfig {
  for (const key of ['PUBLIC_ANALYTICS_ENABLED', 'PUBLIC_ANALYTICS_POLICY_APPROVED'] as const)
    if (env[key] && !['true', 'false'].includes(env[key]!))
      throw new Error(`${key} must be true or false.`);
  const enabled = env.PUBLIC_ANALYTICS_ENABLED === 'true';
  const measurementId = env.PUBLIC_GA4_MEASUREMENT_ID?.trim() || null;
  if (enabled && (!measurementId || !/^G-[A-Z0-9]{6,20}$/.test(measurementId)))
    throw new Error('Analytics requires a genuine GA4 web measurement ID.');
  if (enabled && env.PUBLIC_ANALYTICS_POLICY_APPROVED !== 'true')
    throw new Error('Review the actual privacy policy before approving analytics activation.');
  return { enabled, measurementId: enabled ? measurementId : null };
}

export function parseAnalyticsConsent(
  raw: string | null,
  now = Date.now(),
): AnalyticsConsent | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw);
    if (
      value.version !== 1 ||
      !['accepted', 'rejected'].includes(value.choice) ||
      !Number.isFinite(value.expiresAt) ||
      value.expiresAt <= now ||
      value.expiresAt > now + CONSENT_LIFETIME
    )
      return null;
    return value;
  } catch {
    return null;
  }
}

export function mayMeasure(
  config: AnalyticsConfig,
  consent: AnalyticsConsent | null,
  signals: { doNotTrack?: string | null; globalPrivacyControl?: boolean },
  now = Date.now(),
): boolean {
  return (
    config.enabled &&
    !!config.measurementId &&
    consent?.choice === 'accepted' &&
    consent.version === 1 &&
    consent.expiresAt > now &&
    signals.doNotTrack !== '1' &&
    signals.doNotTrack !== 'yes' &&
    !signals.globalPrivacyControl
  );
}

/** Omit URL queries, fragments and referral data, including Finder/comparison answers. */
export function analyticsPageLocation(href: string): string {
  const url = new URL(href);
  return `${url.origin}${url.pathname}`;
}

export function productClickPayload(
  link: { href: string; printerId?: string; kind?: string },
  origin: string,
  productHosts: Record<string, string>,
): { printer_id: string; link_kind: string; destination_host: string } | null {
  if (!link.printerId || !Object.hasOwn(productHosts, link.printerId)) return null;
  if (!['manufacturer', 'affiliate'].includes(link.kind || '')) return null;
  try {
    const url = new URL(link.href);
    if (url.protocol !== 'https:' || url.origin === origin || url.username || url.password)
      return null;
    const expectedHost =
      link.kind === 'affiliate' ? 'www.amazon.com' : productHosts[link.printerId];
    if (url.hostname !== expectedHost) return null;
    if (link.kind === 'affiliate' && !/^\/dp\/[A-Z0-9]{10}\/?$/.test(url.pathname)) return null;
    return { printer_id: link.printerId, link_kind: link.kind!, destination_host: url.hostname };
  } catch {
    return null;
  }
}
