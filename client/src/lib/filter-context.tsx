import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FilterContextType {
  product: string;
  setProduct: (value: string) => void;
  factory: string;
  setFactory: (value: string) => void;
  process: string;
  setProcess: (value: string) => void;
  equipment: string;
  setEquipment: (value: string) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [product, setProduct] = useState("all");
  const [factory, setFactory] = useState("all");
  const [process, setProcess] = useState("all");
  const [equipment, setEquipment] = useState("all");

  return (
    <FilterContext.Provider value={{ product, setProduct, factory, setFactory, process, setProcess, equipment, setEquipment }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
}
