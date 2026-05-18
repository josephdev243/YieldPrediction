import { get, post, put, del } from "../lib/api";
import type { YieldRecord, Crop, ApiResponse } from "../lib/types";

/**
 * Get all crops for a farmer
 */
export const getFarmerCrops = async (
  farmerId: string,
): Promise<ApiResponse<Crop[]>> => {
  return get<Crop[]>(`/farmers/${farmerId}/crops`);
};

/**
 * Get crops for a specific field
 */
export const getFieldCrops = async (
  fieldId: string,
): Promise<ApiResponse<Crop[]>> => {
  return get<Crop[]>(`/fields/${fieldId}/crops`);
};

/**
 * Get single crop
 */
export const getCrop = async (cropId: string): Promise<ApiResponse<Crop>> => {
  return get<Crop>(`/crops/${cropId}`);
};

/**
 * Create new crop
 */
export const createCrop = async (
  cropData: Partial<Crop>,
): Promise<ApiResponse<Crop>> => {
  return post<Crop>("/crops", cropData);
};

/**
 * Update crop
 */
export const updateCrop = async (
  cropId: string,
  cropData: Partial<Crop>,
): Promise<ApiResponse<Crop>> => {
  return put<Crop>(`/crops/${cropId}`, cropData);
};

/**
 * Delete crop
 */
export const deleteCrop = async (
  cropId: string,
): Promise<ApiResponse<void>> => {
  return del<void>(`/crops/${cropId}`);
};

/**
 * Get yield records for a crop
 */
export const getCropYieldRecords = async (
  cropId: string,
): Promise<ApiResponse<YieldRecord[]>> => {
  return get<YieldRecord[]>(`/crops/${cropId}/yields`);
};

/**
 * Get all yield records for farmer
 */
export const getFarmerYieldRecords = async (
  farmerId: string,
): Promise<ApiResponse<YieldRecord[]>> => {
  return get<YieldRecord[]>(`/farmers/${farmerId}/yields`);
};

/**
 * Record yield harvest
 */
export const recordYield = async (
  yieldData: Partial<YieldRecord>,
): Promise<ApiResponse<YieldRecord>> => {
  return post<YieldRecord>("/yields", yieldData);
};

/**
 * Update yield record
 */
export const updateYield = async (
  yieldId: string,
  yieldData: Partial<YieldRecord>,
): Promise<ApiResponse<YieldRecord>> => {
  return put<YieldRecord>(`/yields/${yieldId}`, yieldData);
};

/**
 * Delete yield record
 */
export const deleteYield = async (
  yieldId: string,
): Promise<ApiResponse<void>> => {
  return del<void>(`/yields/${yieldId}`);
};

/**
 * Calculate total yield
 */
export const calculateTotalYield = (yieldRecords: YieldRecord[]): number => {
  return yieldRecords.reduce(
    (total, record) => total + record.quantityHarvested,
    0,
  );
};

/**
 * Calculate average yield per crop
 */
export const calculateAverageYield = (yieldRecords: YieldRecord[]): number => {
  if (yieldRecords.length === 0) return 0;
  return calculateTotalYield(yieldRecords) / yieldRecords.length;
};

/**
 * Get yield by month
 */
export const getYieldByMonth = (
  yieldRecords: YieldRecord[],
): Record<string, number> => {
  const yieldByMonth: Record<string, number> = {};

  yieldRecords.forEach((record) => {
    const date = new Date(record.harvestDate);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    yieldByMonth[monthKey] =
      (yieldByMonth[monthKey] || 0) + record.quantityHarvested;
  });

  return yieldByMonth;
};

/**
 * Get quality grade distribution
 */
export const getQualityDistribution = (
  yieldRecords: YieldRecord[],
): Record<string, number> => {
  const distribution: Record<string, number> = {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
  };

  yieldRecords.forEach((record) => {
    distribution[record.qualityGrade]++;
  });

  return distribution;
};

/**
 * Get yield trend
 */
export const getYieldTrend = (yieldRecords: YieldRecord[]): number => {
  if (yieldRecords.length < 2) return 0;

  const sortedRecords = [...yieldRecords].sort(
    (a, b) =>
      new Date(a.harvestDate).getTime() - new Date(b.harvestDate).getTime(),
  );

  const half = Math.ceil(sortedRecords.length / 2);
  const firstHalf = sortedRecords.slice(0, half);
  const secondHalf = sortedRecords.slice(half);

  const firstAvg = calculateAverageYield(firstHalf);
  const secondAvg = calculateAverageYield(secondHalf);

  if (firstAvg === 0) return 0;
  return ((secondAvg - firstAvg) / firstAvg) * 100;
};
