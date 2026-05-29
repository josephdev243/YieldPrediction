import { useState, useCallback, useEffect } from "react";
import type { Farmer, Field } from "../lib/types";
import {
  getFarmerProfile,
  createFarmerProfile,
  updateFarmerProfile,
  getFarmerFields,
  createField,
  updateField,
  deleteField,
  saveFarmerData,
  getFarmerDataFromStorage,
} from "../services/farmerService";

interface UseFarmerReturn {
  farmer: Farmer | null;
  fields: Field[];
  isLoading: boolean;
  error: string | null;
  fetchFarmer: (farmerId: string) => Promise<void>;
  createFarmer: (data: Partial<Farmer>) => Promise<void>;
  updateFarmer: (data: Partial<Farmer>) => Promise<void>;
  fetchFields: (farmerId: string) => Promise<void>;
  addField: (data: Partial<Field>) => Promise<void>;
  updateFieldData: (fieldId: string, data: Partial<Field>) => Promise<void>;
  removeField: (fieldId: string) => Promise<void>;
  clearError: () => void;
}

/**
 * Custom hook for farmer profile and fields management
 */
export const useFarmer = (): UseFarmerReturn => {
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [fields, setFields] = useState<Field[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Try to load farmer from storage on mount
  useEffect(() => {
    const storedFarmer = getFarmerDataFromStorage();
    if (storedFarmer) {
      setFarmer(storedFarmer);
    }
  }, []);

  const fetchFields = useCallback(async (farmerId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getFarmerFields(farmerId);

      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch fields");
      }

      setFields(response.data);
    } catch (err: any) {
      setError(err.message || "Error fetching fields");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchFarmer = useCallback(
    async (farmerId: string) => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await getFarmerProfile(farmerId);

        if (!response.success || !response.data) {
          throw new Error(response.error || "Failed to fetch farmer");
        }

        saveFarmerData(response.data);
        setFarmer(response.data);

        // Auto-fetch fields after farmer is loaded
        await fetchFields(farmerId);
      } catch (err: any) {
        setError(err.message || "Error fetching farmer");
      } finally {
        setIsLoading(false);
      }
    },
    [fetchFields],
  );

  const createFarmer = useCallback(async (data: Partial<Farmer>) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await createFarmerProfile(data);

      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to create farmer");
      }

      saveFarmerData(response.data);
      setFarmer(response.data);
    } catch (err: any) {
      setError(err.message || "Error creating farmer");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateFarmer = useCallback(
    async (data: Partial<Farmer>) => {
      try {
        if (!farmer) {
          throw new Error("No farmer loaded");
        }

        setIsLoading(true);
        setError(null);

        const response = await updateFarmerProfile(farmer.id, data);

        if (!response.success || !response.data) {
          throw new Error(response.error || "Failed to update farmer");
        }

        saveFarmerData(response.data);
        setFarmer(response.data);
      } catch (err: any) {
        setError(err.message || "Error updating farmer");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [farmer],
  );

  const addField = useCallback(async (data: Partial<Field>) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await createField(data);

      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to create field");
      }

      setFields((prev) => [...prev, response.data as Field]);
    } catch (err: any) {
      setError(err.message || "Error creating field");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateFieldData = useCallback(
    async (fieldId: string, data: Partial<Field>) => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await updateField(fieldId, data);

        if (!response.success || !response.data) {
          throw new Error(response.error || "Failed to update field");
        }

        setFields((prev) =>
          prev.map((f) => (f.id === fieldId ? (response.data as Field) : f)),
        );
      } catch (err: any) {
        setError(err.message || "Error updating field");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const removeField = useCallback(async (fieldId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await deleteField(fieldId);

      if (!response.success) {
        throw new Error(response.error || "Failed to delete field");
      }

      setFields((prev) => prev.filter((f) => f.id !== fieldId));
    } catch (err: any) {
      setError(err.message || "Error deleting field");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    farmer,
    fields,
    isLoading,
    error,
    fetchFarmer,
    createFarmer,
    updateFarmer,
    fetchFields,
    addField,
    updateFieldData,
    removeField,
    clearError,
  };
};
