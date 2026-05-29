import { del, get, post, put } from "../lib/api";
import type {
  ApiResponse,
  InputUsage,
  InputUsageSummary,
  InputUsageUnit,
  InputResourceType,
} from "../lib/types";

interface RawInputUsage {
  id: string;
  field: string;
  field_name?: string;
  season: string;
  season_year: number;
  resource_type: InputResourceType;
  quantity: number;
  unit: InputUsageUnit;
  cost?: number | null;
  application_date: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

interface InputUsagePayload {
  field: string;
  season: string;
  season_year: number;
  resource_type: InputResourceType;
  quantity: number;
  unit: InputUsageUnit;
  cost?: number;
  application_date: string;
  notes?: string;
}

const toInputUsage = (item: RawInputUsage): InputUsage => ({
  id: item.id,
  fieldId: item.field,
  fieldName: item.field_name,
  season: item.season,
  seasonYear: item.season_year,
  resourceType: item.resource_type,
  quantity: item.quantity,
  unit: item.unit,
  cost: item.cost ?? undefined,
  applicationDate: new Date(item.application_date),
  notes: item.notes,
  createdAt: new Date(item.created_at),
  updatedAt: item.updated_at ? new Date(item.updated_at) : undefined,
});

const toPayload = (data: Partial<InputUsage>): Partial<InputUsagePayload> => ({
  field: data.fieldId,
  season: data.season,
  season_year: data.seasonYear,
  resource_type: data.resourceType,
  quantity: data.quantity,
  unit: data.unit,
  cost: data.cost,
  application_date: data.applicationDate
    ? new Date(data.applicationDate).toISOString().slice(0, 10)
    : undefined,
  notes: data.notes,
});

const wrapListResponse = (
  response: ApiResponse<RawInputUsage[]>,
): ApiResponse<InputUsage[]> => {
  if (!response.success || !response.data) {
    return { success: false, error: response.error, message: response.message };
  }

  return {
    success: true,
    message: response.message,
    data: response.data.map(toInputUsage),
  };
};

const wrapSingleResponse = (
  response: ApiResponse<RawInputUsage>,
): ApiResponse<InputUsage> => {
  if (!response.success || !response.data) {
    return { success: false, error: response.error, message: response.message };
  }

  return {
    success: true,
    message: response.message,
    data: toInputUsage(response.data),
  };
};

export const getInputUsages = async (params?: {
  fieldId?: string;
  season?: string;
  seasonYear?: number;
  resourceType?: InputResourceType;
}): Promise<ApiResponse<InputUsage[]>> => {
  const query = new URLSearchParams();

  if (params?.fieldId) query.set("field", params.fieldId);
  if (params?.season) query.set("season", params.season);
  if (typeof params?.seasonYear === "number") {
    query.set("season_year", String(params.seasonYear));
  }
  if (params?.resourceType) query.set("resource_type", params.resourceType);

  const suffix = query.toString() ? `?${query.toString()}` : "";
  const response = await get<RawInputUsage[]>(`/input-usages/${suffix}`);
  return wrapListResponse(response);
};

export const createInputUsage = async (
  data: Partial<InputUsage>,
): Promise<ApiResponse<InputUsage>> => {
  const response = await post<RawInputUsage>("/input-usages/", toPayload(data));
  return wrapSingleResponse(response);
};

export const updateInputUsage = async (
  id: string,
  data: Partial<InputUsage>,
): Promise<ApiResponse<InputUsage>> => {
  const response = await put<RawInputUsage>(`/input-usages/${id}/`, toPayload(data));
  return wrapSingleResponse(response);
};

export const deleteInputUsage = async (
  id: string,
): Promise<ApiResponse<void>> => {
  return del<void>(`/input-usages/${id}/`);
};

export const getInputUsageSeasonalSummary = async (params?: {
  fieldId?: string;
  season?: string;
  seasonYear?: number;
}): Promise<ApiResponse<InputUsageSummary>> => {
  const query = new URLSearchParams();

  if (params?.fieldId) query.set("field_id", params.fieldId);
  if (params?.season) query.set("season", params.season);
  if (typeof params?.seasonYear === "number") {
    query.set("season_year", String(params.seasonYear));
  }

  const suffix = query.toString() ? `?${query.toString()}` : "";
  return get<InputUsageSummary>(`/input-usages/seasonal_summary/${suffix}`);
};
