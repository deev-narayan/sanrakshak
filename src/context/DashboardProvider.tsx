'use client';

import type { Batch, UserRole } from '@/lib/schemas';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface DashboardContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  batches: Batch[];
  refreshBatches: () => void;
  isLoading: boolean;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<UserRole>('Farmer');
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBatches = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/batches');
      if (!response.ok) {
        throw new Error('Failed to fetch batches');
      }
      const data = await response.json();
      setBatches(data);
    } catch (error) {
      console.error(error);
      // Handle error (e.g., show a toast notification)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const refreshBatches = () => {
    fetchBatches();
  };

  return (
    <DashboardContext.Provider value={{ role, setRole, batches, refreshBatches, isLoading }}>
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
