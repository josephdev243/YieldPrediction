import React, { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { Farmer, Field } from "../lib/types";
import { useFarmer } from "../hooks/useFarmer";

interface FarmerContextType {
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

const FarmerContext = createContext<FarmerContextType | undefined>(undefined);

export const FarmerProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const farmer = useFarmer();

  return (
    <FarmerContext.Provider value={farmer}>{children}</FarmerContext.Provider>
  );
};

export const useFarmerContext = (): FarmerContextType => {
  const context = useContext(FarmerContext);
  if (context === undefined) {
    throw new Error("useFarmerContext must be used within FarmerProvider");
  }
  return context;
};
