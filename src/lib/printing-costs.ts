/** Planning model, USD. No manufacturer defaults, market prices or replacement predictions. */
export interface PrintingSetup {
  dailyLabels: number;
  daysPerMonth: number;
  wastePercent: number;
  packPrice: number;
  labelsPerPack: number;
  printerPrice: number;
  lifeMonths: number;
  maintenanceMonthly: number;
  energyKwhMonthly: number;
  electricityRate: number;
  otherMonthly: number;
}
export const inputRules: Record<keyof PrintingSetup, { min: number; max: number; step: number }> = {
  dailyLabels: { min: 0, max: 10000, step: 1 },
  daysPerMonth: { min: 1, max: 31, step: 1 },
  wastePercent: { min: 0, max: 99, step: 0.1 },
  packPrice: { min: 0, max: 100000, step: 0.01 },
  labelsPerPack: { min: 1, max: 1000000, step: 1 },
  printerPrice: { min: 0, max: 100000, step: 0.01 },
  lifeMonths: { min: 1, max: 120, step: 1 },
  maintenanceMonthly: { min: 0, max: 100000, step: 0.01 },
  energyKwhMonthly: { min: 0, max: 100000, step: 0.01 },
  electricityRate: { min: 0, max: 100, step: 0.001 },
  otherMonthly: { min: 0, max: 100000, step: 0.01 },
};
const whole = new Set<keyof PrintingSetup>([
  'dailyLabels',
  'daysPerMonth',
  'labelsPerPack',
  'lifeMonths',
]);
export function validCostField(key: keyof PrintingSetup, value: number) {
  const rule = inputRules[key];
  return (
    Number.isFinite(value) &&
    value >= rule.min &&
    value <= rule.max &&
    (!whole.has(key) || Number.isInteger(value))
  );
}
export const costProfiles = {
  small: {
    label: 'Small Etsy Shop',
    values: {
      dailyLabels: 10,
      daysPerMonth: 22,
      wastePercent: 3,
      packPrice: 20,
      labelsPerPack: 500,
      printerPrice: 200,
      lifeMonths: 36,
      maintenanceMonthly: 0,
      energyKwhMonthly: 0,
      electricityRate: 0,
      otherMonthly: 0,
    },
  },
  growing: {
    label: 'Growing Online Store',
    values: {
      dailyLabels: 50,
      daysPerMonth: 22,
      wastePercent: 3,
      packPrice: 35,
      labelsPerPack: 1000,
      printerPrice: 300,
      lifeMonths: 36,
      maintenanceMonthly: 0,
      energyKwhMonthly: 0,
      electricityRate: 0,
      otherMonthly: 0,
    },
  },
  volume: {
    label: 'High-Volume Shipping',
    values: {
      dailyLabels: 200,
      daysPerMonth: 26,
      wastePercent: 2,
      packPrice: 60,
      labelsPerPack: 2000,
      printerPrice: 400,
      lifeMonths: 36,
      maintenanceMonthly: 0,
      energyKwhMonthly: 0,
      electricityRate: 0,
      otherMonthly: 0,
    },
  },
} satisfies Record<string, { label: string; values: PrintingSetup }>;
export const defaultSetup: PrintingSetup = { ...costProfiles.small.values };
export function estimatePrintingCosts(input: PrintingSetup) {
  if (
    Object.keys(inputRules).some(
      (k) => !validCostField(k as keyof PrintingSetup, input[k as keyof PrintingSetup]),
    )
  )
    return null;
  const usableLabels = input.dailyLabels * input.daysPerMonth;
  // Remove only floating-point noise at a whole-label boundary, never round currency early.
  const rawLabels = usableLabels / (1 - input.wastePercent / 100);
  const consumedLabels = Math.max(
    0,
    Math.ceil(rawLabels - Number.EPSILON * Math.max(1, rawLabels) * 4),
  );
  const wastedLabels = consumedLabels - usableLabels;
  const stockPerLabel = input.packPrice / input.labelsPerPack;
  const consumables = consumedLabels * stockPerLabel;
  const wasteCost = wastedLabels * stockPerLabel;
  const electricity = input.energyKwhMonthly * input.electricityRate;
  const extras = input.maintenanceMonthly + electricity + input.otherMonthly;
  const operatingMonthly = consumables + extras;
  const printerAllocation = input.printerPrice / input.lifeMonths;
  const monthly = operatingMonthly + printerAllocation;
  return {
    usableLabels,
    consumedLabels,
    wastedLabels,
    stockPerLabel,
    consumables,
    wasteCost,
    electricity,
    extras,
    operatingMonthly,
    printerAllocation,
    monthly,
    annual: monthly * 12,
    consumablesPerUsableLabel: usableLabels ? consumables / usableLabels : null,
    totalPerUsableLabel: usableLabels ? monthly / usableLabels : null,
    packsNeeded: Math.ceil(consumedLabels / input.labelsPerPack),
    packPurchase: Math.ceil(consumedLabels / input.labelsPerPack) * input.packPrice,
  };
}
export function comparePrintingSetups(a: PrintingSetup, b: PrintingSetup, months: number) {
  // Same shipping demand and waste definition in both scenarios.
  const sharedB = {
    ...b,
    dailyLabels: a.dailyLabels,
    daysPerMonth: a.daysPerMonth,
    wastePercent: a.wastePercent,
  };
  const first = estimatePrintingCosts(a),
    second = estimatePrintingCosts(sharedB);
  if (!first || !second || !Number.isInteger(months) || months < 1 || months > 120) return null;
  const difference = second.operatingMonthly - first.operatingMonthly;
  const upfrontDifference = a.printerPrice - b.printerPrice;
  const crossing = difference === 0 ? null : upfrontDifference / difference;
  const breakEvenMonths =
    crossing !== null && Number.isFinite(crossing) && crossing > 0 ? crossing : null;
  return {
    a: first,
    b: second,
    months,
    totalA: a.printerPrice + first.operatingMonthly * months,
    totalB: b.printerPrice + second.operatingMonthly * months,
    breakEvenMonths,
    beyondLife: months > a.lifeMonths || months > b.lifeMonths,
  };
}
export interface CostShareState {
  a: PrintingSetup;
  b: PrintingSetup;
  compare: boolean;
  months: number;
}
/** Only allowlisted bounded numeric assumptions; no free text, PII, queries or storage. */
export function serializeCostState(state: CostShareState): string {
  if (!comparePrintingSetups(state.a, state.b, state.months) || !estimatePrintingCosts(state.b))
    throw new Error('Invalid estimate');
  return (
    'calc=' +
    encodeURIComponent(
      JSON.stringify({
        v: 2,
        a: Object.keys(inputRules).map((k) => state.a[k as keyof PrintingSetup]),
        b: Object.keys(inputRules).map((k) => state.b[k as keyof PrintingSetup]),
        c: state.compare ? 1 : 0,
        m: state.months,
      }),
    )
  );
}
export function parseCostState(hash: string): CostShareState | null {
  if (!hash || hash.length > 3000) return null;
  try {
    const raw = new URLSearchParams(hash.replace(/^#/, '')).get('calc');
    if (!raw) return null;
    const value = JSON.parse(raw),
      keys = Object.keys(inputRules);
    if (
      value.v !== 2 ||
      ![0, 1].includes(value.c) ||
      !Array.isArray(value.a) ||
      !Array.isArray(value.b) ||
      value.a.length !== keys.length ||
      value.b.length !== keys.length
    )
      return null;
    const setup = (values: unknown[]) =>
      Object.fromEntries(keys.map((k, i) => [k, values[i]])) as unknown as PrintingSetup;
    const state = { a: setup(value.a), b: setup(value.b), compare: value.c === 1, months: value.m };
    if (
      !estimatePrintingCosts(state.a) ||
      !estimatePrintingCosts(state.b) ||
      !comparePrintingSetups(state.a, state.b, state.months)
    )
      return null;
    return state;
  } catch {
    return null;
  }
}
