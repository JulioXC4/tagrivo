import { amazonLinkFor, affiliateRel } from '../lib/affiliate';
import { amazonAssociateTag } from '../config/integrations';
import { amazonListings } from '../data/amazon';

/** Server rendered on editorial pages; reused inside existing React islands without effects. */
export default function AmazonCTA({
  printerId,
  prominent = false,
}: {
  printerId: string;
  prominent?: boolean;
}) {
  const href = amazonLinkFor(printerId, amazonAssociateTag);
  if (!href) return null;
  return (
    <div className="amazon-cta">
      <a
        href={href}
        className={prominent ? 'button' : 'text-link'}
        target="_blank"
        rel={affiliateRel}
        data-link-kind="affiliate"
        data-printer-id={printerId}
        aria-label={`Check on Amazon: ${amazonListings[printerId].variant}. Paid link; opens in a new tab.`}
      >
        <span>
          Check on Amazon <span className="paid-link">(Paid link)</span>
        </span>
      </a>
    </div>
  );
}
