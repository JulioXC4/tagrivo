import { printers, type OperatingSystem, type Connection } from '../data/printers.ts';
import { supportsRoute } from '../data/workflows.ts';
export const problems = {
  detection: 'Printer not detected',
  small: 'Label printing too small',
  clipped: 'Label cut off',
  wireless: 'Bluetooth or Wi-Fi issues',
  barcode: 'Blurry barcode',
  driver: 'Driver installation issues',
} as const;
export type Problem = keyof typeof problems;
const steps: Record<Problem, string[]> = {
  detection: [
    'Confirm the printer is powered on and not showing a model-specific error. Read its status indicator in the official manual.',
    'For USB, use a data-capable cable and select the active printer queue. A charging-only cable or another USB port can change detection.',
    'Open the OS printer settings or supported mobile app. Do not assume Bluetooth pairing adds a system printer.',
  ],
  small: [
    'Check the original PDF page size. A shipping label on a Letter-size PDF is not a native 4 × 6 document.',
    'Choose the matching stock size in both the application and printer driver. Inspect the preview before consuming stock.',
    'For an already correctly sized label, check actual-size / 100% settings. If the source is a full sheet, obtain the provider’s thermal format rather than enlarging a screenshot.',
  ],
  clipped: [
    'Compare the source PDF dimensions with the physical label, including 100 × 150 mm versus true 4 × 6 in.',
    'Check orientation and the printable area in the driver preview. A forced 100% scale can crop content on smaller stock.',
    'Use the exact manual for media-guide placement and label detection. Calibration buttons and feed sequences differ by model.',
  ],
  wireless: [
    'Identify the actual print transport. Bluetooth setup, Bluetooth printing and Wi-Fi printing are different routes.',
    'For network printing, confirm device discovery on the same local network. A guest network or device isolation may prevent access.',
    'For mobile Bluetooth, import the PDF into the manufacturer-supported app and select the exact model. Do not assume every marketplace app prints over Bluetooth.',
  ],
  barcode: [
    'Use the original shipping PDF rather than a low-resolution screenshot or image stretched from another size.',
    'Check supported stock, media loading and the driver’s documented darkness / speed settings. Change one setting and print a sample.',
    'Inspect the printhead using the manufacturer’s cleaning instructions. Do not use improvised solvents or touch a hot printhead. Visual sharpness does not certify carrier barcode acceptance.',
  ],
  driver: [
    'Match the exact model, OS release and processor architecture before downloading anything.',
    'Use the manufacturer’s download page, not an advertisement or an unrelated “driver updater.” Some mobile routes use an app rather than a desktop driver.',
    'Follow the official installation order and review OS security prompts. Never disable system security just to force an incompatible driver.',
  ],
};
export function diagnose(
  problem: Problem,
  os: OperatingSystem,
  connection: Exclude<Connection, 'any'>,
  model: string,
) {
  const printer = printers.find((p) => p.id === model);
  const warning =
    printer && !supportsRoute(printer, os, connection)
      ? 'This exact device / connection route is not verified in Tagrivo’s catalog. Changing print settings cannot add a missing interface or driver. Choose a documented route first.'
      : null;
  return {
    printer,
    warning,
    steps: steps[problem],
    setup: printer?.setup,
    sources: printer?.sources || [],
  };
}
