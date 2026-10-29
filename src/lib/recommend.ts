import {
  printers,
  systemNames,
  connectionNames,
  getConnectionLabels,
  type OperatingSystem,
  type Connection,
} from '../data/printers.ts';

export interface FinderAnswers {
  platform: string;
  os: OperatingSystem;
  volume: number;
  connection: Connection;
  budget: number;
}
export function recommend(answers: FinderAnswers) {
  const excluded: { name: string; reason: string }[] = [];
  const matches = printers
    .flatMap((printer) => {
      let reason = '';
      if (!printer.systems.includes(answers.os))
        reason = `No verified ${systemNames[answers.os]} workflow for this exact model in our catalog.`;
      else if (answers.connection !== 'any' && !printer.connections.includes(answers.connection))
        reason = `Does not support ${connectionNames[answers.connection]} printing.`;
      else if (answers.connection === 'usb' && ['ios', 'android'].includes(answers.os))
        reason = 'We have not verified direct USB printing from this mobile device.';
      else if (answers.connection === 'bluetooth' && ['mac', 'ios', 'android'].includes(answers.os))
        reason =
          'Direct Bluetooth shipping-label printing is not sufficiently verified for this OS and app combination. Try Wi-Fi.';
      else if (printer.price !== null && printer.price > answers.budget)
        reason = `Its dated manufacturer price ($${printer.price}) exceeds your $${answers.budget} budget; check for changes.`;
      if (reason) {
        excluded.push({ name: printer.name, reason });
        return [];
      }
      const reasons = [
        `The manufacturer documents a ${systemNames[answers.os]} workflow.`,
        answers.connection === 'any'
          ? `Offers ${getConnectionLabels(printer).join(', ')}.`
          : `Supports your preferred ${connectionNames[answers.connection]} connection.`,
      ];
      const cautions = [printer.setup];
      if (printer.price === null)
        cautions.push(
          `Current price is unverified. Confirm this model costs $${answers.budget} or less before buying.`,
        );
      else
        cautions.push(
          `The $${printer.price} dated reference is within your cap. ${printer.priceNote}`,
        );
      if (answers.volume >= 250) {
        reasons.push(
          printer.cutter
            ? 'The automatic cutter may be useful for repeated batches; compare the cost of DK rolls.'
            : 'Generic fanfold stock can support your batch workflow; allow space for external media.',
        );
        cautions.push(
          'Your volume makes consumables and batch handling important. Rated speed is not a tested duty-cycle guarantee.',
        );
      }
      if (answers.os === 'chrome')
        cautions.push(
          'ChromeOS setup may depend on network printing or a browser extension; check the linked manufacturer instructions.',
        );
      // Tie-break only on documented features relevant to the answers, never brand IDs or price upsells.
      const connectionExtras = answers.connection === 'usb' ? printer.connections.length : 0;
      const batchMedia = answers.volume >= 250 && printer.media.startsWith('Generic') ? 1 : 0;
      if (answers.connection === 'usb' && printer.connections.length === 1)
        reasons.push('A USB-only model keeps a dedicated computer setup straightforward.');
      return [{ printer, reasons, cautions, connectionExtras, batchMedia }];
    })
    .sort((a, b) => a.connectionExtras - b.connectionExtras || b.batchMedia - a.batchMedia);
  const platformGuidance: Record<string, string> = {
    Etsy: 'Etsy currently describes 4 × 6 formatting for USPS labels; confirm the format for your carrier and service. Rollo recommends a computer-browser route and documents Etsy-app limitations. Printer compatibility does not establish that every Etsy label or app route works.',
    Shopify:
      'Shopify distinguishes its supported models from a general PDF workflow. Its list names Brother QL-1110NWB and Rollo X1038; the latter is a different model from our Wireless X1040. Confirm the exact device and app rather than inferring official support from a brand name.',
    eBay: 'eBay documents a 4 × 6 label format in its label-printing workflow. Check the carrier/service format, PDF size and printer settings; do not assume every eBay label type has identical requirements.',
  };
  return {
    matches,
    excluded,
    platformNote: `${platformGuidance[answers.platform] || 'Obtain a correctly sized shipping-label PDF and confirm that your device and application can print it.'} Platform choice changes guidance, not the hardware ranking. See our platform workflow guide for official sources.`,
  };
}
