'use client';

import FarmerDashboard from '@/components/dashboard/FarmerDashboard';
import LabDashboard from '@/components/dashboard/LabDashboard';
import ManufacturerDashboard from '@/components/dashboard/ManufacturerDashboard';
import RegulatorDashboard from '@/components/dashboard/RegulatorDashboard';
import { useDashboard } from '@/context/DashboardProvider';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { role, isLoading } = useDashboard();

  if (isLoading) {
    return <DashboardSkeleton />;
  }
  
  const renderDashboard = () => {
    switch (role) {
      case 'Farmer':
        return <FarmerDashboard />;
      case 'Lab':
        return <LabDashboard />;
      case 'Manufacturer':
        return <ManufacturerDashboard />;
      case 'Regulator':
        return <RegulatorDashboard />;
      default:
        return <div>Select a role</div>;
    }
  };

  return <div className="animate-in fade-in-50">{renderDashboard()}</div>;
}

const DashboardSkeleton = () => (
    <div className="space-y-6">
        <div className="space-y-2">
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-4 w-1/3" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-40 rounded-lg" />
            <Skeleton className="h-40 rounded-lg" />
            <Skeleton className="h-40 rounded-lg lg:col-span-1" />
        </div>
        <Skeleton className="h-64 rounded-lg" />
    </div>
)
