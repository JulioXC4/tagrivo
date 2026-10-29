import {
  CONSENT_KEY,
  CONSENT_LIFETIME,
  parseAnalyticsConsent,
  mayMeasure,
  analyticsPageLocation,
  productClickPayload,
  type AnalyticsConsent,
} from '../lib/analytics';

declare global {
  interface Window {
    dataLayer?: unknown[];
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

export function initAnalytics() {
  const panel = document.querySelector<HTMLElement>('#analytics-preferences');
  if (!panel?.dataset.measurementId) return;
  const config = { enabled: true, measurementId: panel.dataset.measurementId };
  const id = config.measurementId;
  const productHosts = JSON.parse(panel.dataset.productHosts || '{}') as Record<string, string>;
  const status = panel.querySelector<HTMLElement>('[data-analytics-status]')!;
  const heading = panel.querySelector<HTMLElement>('h2')!;
  const signals = () => ({
    doNotTrack: navigator.doNotTrack,
    globalPrivacyControl: (navigator as Navigator & { globalPrivacyControl?: boolean })
      .globalPrivacyControl,
  });
  let consent: AnalyticsConsent | null = null;
  try {
    consent = parseAnalyticsConsent(localStorage.getItem(CONSENT_KEY));
  } catch {
    /* Off by default. */
  }
  const state = window;
  let started = false;
  let permissionTimer: number | undefined;
  function gtag(..._args: unknown[]) {
    state.dataLayer!.push(arguments);
  }
  function clearCookies() {
    for (const name of ['_ga', `_ga_${id.slice(2)}`])
      document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax; Secure`;
  }
  function checkPermission() {
    if (permissionTimer !== undefined) window.clearTimeout(permissionTimer);
    if (!started) return;
    if (!mayMeasure(config, consent, signals())) {
      state[`ga-disable-${id}`] = true;
      clearCookies();
      location.reload();
      return;
    }
    // Bound the timeout: thirty days exceeds the browser's signed 32-bit timer limit.
    permissionTimer = window.setTimeout(
      checkPermission,
      Math.min(consent!.expiresAt - Date.now(), 86_400_000),
    );
  }
  function start() {
    if (started || !mayMeasure(config, consent, signals())) return;
    started = true;
    state[`ga-disable-${id}`] = false;
    state.dataLayer = state.dataLayer || [];
    gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
    gtag('consent', 'update', { analytics_storage: 'granted' });
    gtag('js', new Date());
    gtag('config', id, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_domain: 'none',
      cookie_expires: CONSENT_LIFETIME / 1000,
      cookie_update: false,
      page_location: analyticsPageLocation(location.href),
      page_referrer: '',
    });
    gtag('event', 'page_view', {
      page_location: analyticsPageLocation(location.href),
      page_title: document.title,
      page_referrer: '',
    });
    const script = document.createElement('script');
    script.async = true;
    script.referrerPolicy = 'no-referrer';
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
    script.onerror = () => {
      state[`ga-disable-${id}`] = true;
      status.textContent =
        'Optional analytics could not load. All editorial tools remain available.';
    };
    document.head.append(script);
    checkPermission();
  }
  function choose(choice: AnalyticsConsent['choice']) {
    consent = { version: 1, choice, expiresAt: Date.now() + CONSENT_LIFETIME };
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    } catch {
      /* This tab only. */
    }
    if (choice === 'accepted') {
      start();
      status.textContent = mayMeasure(config, consent, signals())
        ? 'Analytics allowed. You can change this choice using Analytics preferences in the footer.'
        : 'Analytics remains off because your browser requests privacy protection.';
    } else {
      state[`ga-disable-${id}`] = true;
      clearCookies();
      status.textContent = 'Analytics declined. Your tools and links continue to work.';
      // Reload after revocation to unload the third-party library and its automatic handlers.
      if (started) location.reload();
    }
  }
  panel
    .querySelector('[data-analytics-accept]')
    ?.addEventListener('click', () => choose('accepted'));
  panel
    .querySelector('[data-analytics-reject]')
    ?.addEventListener('click', () => choose('rejected'));
  document.querySelectorAll('[data-analytics-settings]').forEach((link) =>
    link.addEventListener('click', (event) => {
      event.preventDefault();
      panel.hidden = false;
      heading.focus();
      panel.scrollIntoView({ block: 'center' });
    }),
  );
  document.addEventListener('click', (event) => {
    if (!started || !mayMeasure(config, consent, signals())) return;
    const link =
      event.target instanceof Element
        ? event.target.closest<HTMLAnchorElement>('a[data-printer-id][data-link-kind]')
        : null;
    if (!link) return;
    const payload = productClickPayload(
      { href: link.href, printerId: link.dataset.printerId, kind: link.dataset.linkKind },
      location.origin,
      productHosts,
    );
    if (payload) gtag('event', 'product_outbound_click', payload);
  });
  // A consent change in another tab must also revoke collection in this one.
  window.addEventListener('storage', (event) => {
    if (event.key !== CONSENT_KEY && event.key !== null) return;
    consent = parseAnalyticsConsent(event.newValue);
    if (!mayMeasure(config, consent, signals())) {
      state[`ga-disable-${id}`] = true;
      clearCookies();
      if (started) location.reload();
    }
  });
  window.addEventListener('focus', checkPermission);
  panel.hidden = consent !== null;
  if (!mayMeasure(config, consent, signals())) clearCookies();
  start();
}
