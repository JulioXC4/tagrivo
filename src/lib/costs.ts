export interface CostInputs {
  weeklyOrders: number;
  printerPrice: number;
  packPrice: number;
  labelsPerPack: number;
  waste: number;
  years: number;
}
export function calculateCosts(input: CostInputs) {
  if (
    Object.values(input).some((v) => !Number.isFinite(v)) ||
    input.weeklyOrders < 0 ||
    input.printerPrice < 0 ||
    input.packPrice < 0 ||
    input.labelsPerPack <= 0 ||
    input.years <= 0 ||
    input.waste < 0 ||
    input.waste >= 100
  )
    return null;
  const orders = input.weeklyOrders * 52 * input.years;
  const labels = Math.ceil(orders / (1 - input.waste / 100));
  const unitCost = input.packPrice / input.labelsPerPack;
  const consumables = labels * unitCost;
  const total = input.printerPrice + consumables;
  return {
    orders,
    labels,
    unitCost,
    consumables,
    total,
    perOrder: orders ? total / orders : 0,
    monthly: total / (12 * input.years),
    firstYear:
      input.printerPrice +
      Math.ceil((input.weeklyOrders * 52) / (1 - input.waste / 100)) * unitCost,
  };
}
