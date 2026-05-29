import type { Field, InputResourceType, InputUsage } from "../lib/types";

export interface CropRevenueLineItem {
  cropType: string;
  areaHectares: number;
  pricePerTon: number;
  shareOfFarm: number;
}

export interface ResourceCostLineItem {
  resourceType: InputResourceType;
  totalCost: number;
  entries: number;
}

export interface FinancialSummary {
  totalHectares: number;
  totalInputCost: number;
  costPerHectare: number;
  weightedMarketPricePerTon: number;
  estimatedRevenue: number;
  revenuePerHectare: number;
  seasonProfit: number;
  profitMargin: number;
  breakEvenYieldTons: number;
  cropBreakdown: CropRevenueLineItem[];
  resourceCostBreakdown: ResourceCostLineItem[];
}

const DEFAULT_MARKET_PRICE_PER_TON = 52000;

const CROP_MARKET_PRICES_PER_TON: Record<string, number> = {
  maize: 36000,
  corn: 36000,
  beans: 78000,
  rice: 54000,
  sorghum: 32000,
  millet: 34000,
  cassava: 28000,
  potatoes: 46000,
  potato: 46000,
  vegetables: 86000,
  vegetable: 86000,
  fruits: 64000,
  fruit: 64000,
  wheat: 50000,
};

const RESOURCE_COST_PER_UNIT: Record<InputResourceType, number> = {
  fertilizer: 85,
  pesticide: 420,
  water: 30,
  seed: 1800,
};

const normalizeKey = (value: string): string =>
  value.trim().toLowerCase().replace(/[^a-z]/g, "");

export const getMarketPricePerTon = (cropType: string): number => {
  const normalizedCrop = normalizeKey(cropType);

  if (!normalizedCrop) {
    return DEFAULT_MARKET_PRICE_PER_TON;
  }

  for (const [key, price] of Object.entries(CROP_MARKET_PRICES_PER_TON)) {
    if (normalizedCrop.includes(key)) {
      return price;
    }
  }

  return DEFAULT_MARKET_PRICE_PER_TON;
};

export const getEstimatedInputCost = (usage: InputUsage): number => {
  if (typeof usage.cost === "number") {
    return usage.cost;
  }

  const unitCost = RESOURCE_COST_PER_UNIT[usage.resourceType] || 0;
  return usage.quantity * unitCost;
};

export const calculateFinancialSummary = ({
  fields,
  inputUsages,
  predictedYieldTons,
}: {
  fields: Field[];
  inputUsages: InputUsage[];
  predictedYieldTons: number;
}): FinancialSummary => {
  const totalHectares = fields.reduce(
    (total, field) => total + (field.size || 0),
    0,
  );

  const totalInputCost = inputUsages.reduce(
    (total, usage) => total + getEstimatedInputCost(usage),
    0,
  );

  const cropBreakdown: CropRevenueLineItem[] = [];
  const weightedPriceTotal = fields.reduce((total, field) => {
    const cropType = field.cropType || "Mixed";
    const areaHectares = field.size || 0;
    const pricePerTon = getMarketPricePerTon(cropType);
    const shareOfFarm = totalHectares > 0 ? areaHectares / totalHectares : 0;

    cropBreakdown.push({
      cropType,
      areaHectares,
      pricePerTon,
      shareOfFarm,
    });

    return total + areaHectares * pricePerTon;
  }, 0);

  const weightedMarketPricePerTon =
    totalHectares > 0
      ? weightedPriceTotal / totalHectares
      : DEFAULT_MARKET_PRICE_PER_TON;

  const estimatedRevenue = predictedYieldTons * weightedMarketPricePerTon;
  const costPerHectare = totalHectares > 0 ? totalInputCost / totalHectares : 0;
  const revenuePerHectare = totalHectares > 0 ? estimatedRevenue / totalHectares : 0;
  const seasonProfit = estimatedRevenue - totalInputCost;
  const profitMargin = estimatedRevenue > 0 ? seasonProfit / estimatedRevenue : 0;
  const breakEvenYieldTons =
    weightedMarketPricePerTon > 0
      ? totalInputCost / weightedMarketPricePerTon
      : 0;

  const resourceTotals = inputUsages.reduce((accumulator, usage) => {
    if (!accumulator[usage.resourceType]) {
      accumulator[usage.resourceType] = { totalCost: 0, entries: 0 };
    }

    accumulator[usage.resourceType].totalCost += getEstimatedInputCost(usage);
    accumulator[usage.resourceType].entries += 1;
    return accumulator;
  }, {} as Record<InputResourceType, { totalCost: number; entries: number }>);

  const resourceCostBreakdown = Object.entries(resourceTotals).map(
    ([resourceType, totals]) => ({
      resourceType: resourceType as InputResourceType,
      totalCost: totals.totalCost,
      entries: totals.entries,
    }),
  );

  return {
    totalHectares,
    totalInputCost,
    costPerHectare,
    weightedMarketPricePerTon,
    estimatedRevenue,
    revenuePerHectare,
    seasonProfit,
    profitMargin,
    breakEvenYieldTons,
    cropBreakdown,
    resourceCostBreakdown,
  };
};