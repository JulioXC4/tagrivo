import type { Connection, OperatingSystem, Printer } from './printers.ts';

/** Verified printing routes, not just the radios advertised on the box. */
export const printingRoutes: Record<
  string,
  Partial<Record<OperatingSystem, Exclude<Connection, 'any'>[]>>
> = {
  'rollo-wireless': {
    windows: ['usb', 'wifi'],
    mac: ['usb', 'wifi'],
    ios: ['wifi'],
    android: ['wifi'],
    chrome: ['wifi'],
  },
  'munbyn-itpp941': { windows: ['usb'], mac: ['usb'], chrome: ['usb'] },
  'brother-ql1110nwb': {
    windows: ['usb', 'wifi', 'bluetooth'],
    mac: ['usb', 'wifi'],
    ios: ['wifi'],
    android: ['wifi'],
  },
  'rollo-usb-x1038': { windows: ['usb'], mac: ['usb'] },
  'munbyn-itpp941b': {
    windows: ['usb', 'bluetooth'],
    mac: ['usb'],
    chrome: ['usb'],
    ios: ['bluetooth'],
    android: ['bluetooth'],
  },
  'phomemo-pm241bt': { windows: ['usb'], mac: ['usb'], ios: ['bluetooth'], android: ['bluetooth'] },
  'brother-ql1100': { windows: ['usb'], mac: ['usb'] },
};
export function supportsRoute(
  printer: Printer,
  os: OperatingSystem,
  connection: Connection,
): boolean {
  const routes = printingRoutes[printer.id]?.[os] || [];
  return connection === 'any' ? routes.length > 0 : routes.includes(connection);
}
export function imageCaption(printer: Printer): string {
  return printer.brand === 'Brother'
    ? 'Official Brother product photograph · Marketing Library.'
    : printer.id === 'phomemo-pm241bt'
      ? 'Original manufacturer product image · white/lavender finish.'
      : 'Manufacturer product image · studio composition by Tagrivo.';
}
export type LabelFormat = '4x6' | 'continuous-dk';
export function supportsFormat(printer: Printer, format: LabelFormat): boolean {
  return format === '4x6' || (format === 'continuous-dk' && printer.brand === 'Brother');
}
export function useCase(printer: Printer): string {
  return printer.brand === 'Brother'
    ? 'mixed-labels'
    : printer.connections.length === 1
      ? 'desktop-shipping'
      : 'flexible-shipping';
}
