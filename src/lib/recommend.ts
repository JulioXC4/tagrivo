import {
  printers,
  systemNames,
  connectionNames,
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
          ? `Offers ${printer.connections.map((c) => connectionNames[c]).join(' and ')}.`
          : `Supports your preferred ${connectionNames[answers.connection]} connection.`,
      ];
      const cautions = [printer.setup];
      if (printer.price === null)
        cautions.push(
          `Current price is unverified. Confirm this model costs $${answers.budget} or less before buying.`,
        );
      else
        cautions.push(
          `The $${printer.price} reference fits your budget, but it was checked on October 28, 2026. Confirm today's offer.`,
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
  return {
    matches,
    excluded,
    platformNote: `For ${answers.platform}, download a correctly sized 4 × 6 PDF label and use a supported print workflow. Platform choice changes setup guidance, not the hardware ranking; no native marketplace integration is assumed.`,
  };
}
