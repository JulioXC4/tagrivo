import { resolveAnalyticsConfig } from '../lib/analytics';
import { resolveAmazonStoreId } from '../lib/affiliate';

// Public configuration only. Credentials and legal/operator data do not belong here.
// Store IDs are public attribution IDs, not credentials. The registered owner supplied this one.
export const amazonAssociateTag = resolveAmazonStoreId(import.meta.env.PUBLIC_AMAZON_ASSOCIATE_TAG);
export const analytics = resolveAnalyticsConfig({
  PUBLIC_ANALYTICS_ENABLED: import.meta.env.PUBLIC_ANALYTICS_ENABLED,
  PUBLIC_ANALYTICS_POLICY_APPROVED: import.meta.env.PUBLIC_ANALYTICS_POLICY_APPROVED,
  PUBLIC_GA4_MEASUREMENT_ID: import.meta.env.PUBLIC_GA4_MEASUREMENT_ID,
});
