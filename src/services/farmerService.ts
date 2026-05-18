import { get, post, put, del } from "../lib/api";
import type { Farmer, Field, ApiResponse } from "../lib/types";
import { STORAGE_KEYS } from "../lib/constants";

/**
 * Get farmer profile
 */
export const getFarmerProfile = async (
  farmerId: string,
): Promise<ApiResponse<Farmer>> => {
  return get<Farmer>(`/farmers/${farmerId}`);
};

/**
 * Create farmer profile
 */
export const createFarmerProfile = async (
  farmerData: Partial<Farmer>,
): Promise<ApiResponse<Farmer>> => {
  return post<Farmer>("/farmers", farmerData);
};

/**
 * Update farmer profile
 */
export const updateFarmerProfile = async (
  farmerId: string,
  farmerData: Partial<Farmer>,
): Promise<ApiResponse<Farmer>> => {
  return put<Farmer>(`/farmers/${farmerId}`, farmerData);
};

/**
 * Delete farmer profile
 */
export const deleteFarmerProfile = async (
  farmerId: string,
): Promise<ApiResponse<void>> => {
  return del<void>(`/farmers/${farmerId}`);
};

/**
 * Get all farmer fields
 */
export const getFarmerFields = async (
  farmerId: string,
): Promise<ApiResponse<Field[]>> => {
  return get<Field[]>(`/farmers/${farmerId}/fields`);
};

/**
 * Get single field
 */
export const getField = async (
  fieldId: string,
): Promise<ApiResponse<Field>> => {
  return get<Field>(`/fields/${fieldId}`);
};

/**
 * Create new field
 */
export const createField = async (
  fieldData: Partial<Field>,
): Promise<ApiResponse<Field>> => {
  return post<Field>("/fields", fieldData);
};

/**
 * Update field
 */
export const updateField = async (
  fieldId: string,
  fieldData: Partial<Field>,
): Promise<ApiResponse<Field>> => {
  return put<Field>(`/fields/${fieldId}`, fieldData);
};

/**
 * Delete field
 */
export const deleteField = async (
  fieldId: string,
): Promise<ApiResponse<void>> => {
  return del<void>(`/fields/${fieldId}`);
};

/**
 * Save farmer data to local storage
 */
export const saveFarmerData = (farmer: Farmer): void => {
  localStorage.setItem(STORAGE_KEYS.FARMER_DATA, JSON.stringify(farmer));
};

/**
 * Get farmer data from local storage
 */
export const getFarmerDataFromStorage = (): Farmer | null => {
  const data = localStorage.getItem(STORAGE_KEYS.FARMER_DATA);
  return data ? JSON.parse(data) : null;
};

/**
 * Clear farmer data from storage
 */
export const clearFarmerData = (): void => {
  localStorage.removeItem(STORAGE_KEYS.FARMER_DATA);
};

/**
 * Calculate total farm size
 */
export const calculateTotalFarmSize = (fields: Field[]): number => {
  return fields.reduce((total, field) => total + field.size, 0);
};

/**
 * Get farm statistics
 */
export const getFarmStatistics = (fields: Field[]) => {
  const totalSize = calculateTotalFarmSize(fields);
  const cropTypes = new Set(fields.map((f) => f.cropType));
  const avgSize = fields.length > 0 ? totalSize / fields.length : 0;

  return {
    totalFields: fields.length,
    totalSize,
    averageFieldSize: avgSize,
    uniqueCropTypes: cropTypes.size,
    cropTypes: Array.from(cropTypes),
  };
};
