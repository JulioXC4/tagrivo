import { resolveAnalyticsConfig } from '../lib/analytics';

// Public configuration only. Credentials and legal/operator data do not belong here.
export const amazonAssociateTag = import.meta.env.PUBLIC_AMAZON_ASSOCIATE_TAG?.trim() || undefined;
export const analytics = resolveAnalyticsConfig({
  PUBLIC_ANALYTICS_ENABLED: import.meta.env.PUBLIC_ANALYTICS_ENABLED,
  PUBLIC_ANALYTICS_POLICY_APPROVED: import.meta.env.PUBLIC_ANALYTICS_POLICY_APPROVED,
  PUBLIC_GA4_MEASUREMENT_ID: import.meta.env.PUBLIC_GA4_MEASUREMENT_ID,
});
