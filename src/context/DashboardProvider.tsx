'use client';

import type { Batch, UserRole, Farmer } from '@/lib/schemas';
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface DashboardContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  batches: Batch[];
  refreshBatches: () => void;
  farmers: Farmer[];
  refreshFarmers: () => void;
  isLoading: boolean;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<UserRole>('Farmer');
  const [batches, setBatches] = useState<Batch[]>([]);
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [batchesRes, farmersRes] = await Promise.all([
        fetch('/api/batches'),
        fetch('/api/farmers'),
      ]);

      if (!batchesRes.ok) throw new Error('Failed to fetch batches');
      if (!farmersRes.ok) throw new Error('Failed to fetch farmers');

      const batchesData = await batchesRes.json();
      const farmersData = await farmersRes.json();

      setBatches(batchesData);
      setFarmers(farmersData);
    } catch (error) {
      console.error(error);
      // Handle error (e.g., show a toast notification)
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const refreshBatches = useCallback(async () => {
    try {
      const response = await fetch('/api/batches');
      if (!response.ok) throw new Error('Failed to fetch batches');
      const data = await response.json();
      setBatches(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const refreshFarmers = useCallback(async () => {
     try {
      const response = await fetch('/api/farmers');
      if (!response.ok) throw new Error('Failed to fetch farmers');
      const data = await response.json();
      setFarmers(data);
    } catch (error) {
      console.error(error);
    }
  }, []);


  return (
    <DashboardContext.Provider value={{ role, setRole, batches, refreshBatches, farmers, refreshFarmers, isLoading }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = (): DashboardContextType => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
