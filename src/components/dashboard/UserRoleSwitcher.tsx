'use client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDashboard } from '@/context/DashboardProvider';
import type { UserRole } from '@/lib/schemas';
import { User, TestTube, Factory, Shield } from 'lucide-react';

const roleIcons: Record<UserRole, React.ElementType> = {
  Farmer: User,
  Lab: TestTube,
  Manufacturer: Factory,
  Regulator: Shield,
};

export function UserRoleSwitcher() {
  const { role, setRole } = useDashboard();
  const Icon = roleIcons[role];

  return (
    <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
      <SelectTrigger className="w-auto h-10 gap-2 font-semibold border-2 rounded-lg shadow-sm border-border">
         <Icon className="w-5 h-5 text-accent" />
        <SelectValue placeholder="Select role" />
      </SelectTrigger>
      <SelectContent>
        {Object.keys(roleIcons).map((r) => {
            const CurrentIcon = roleIcons[r as UserRole];
            return (
                <SelectItem key={r} value={r}>
                    <div className='flex items-center gap-2'>
                        <CurrentIcon className="w-4 h-4" />
                        <span>{r}</span>
                    </div>
                </SelectItem>
            )
        })}
      </SelectContent>
    </Select>
  );
}
