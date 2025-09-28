'use client';
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
} from '@/components/ui/sidebar';
import { Bot, User, TestTube, Factory, Shield } from 'lucide-react';
import { useDashboard } from '@/context/DashboardProvider';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/lib/schemas';

const navItems: { role: UserRole; icon: React.ElementType; label: string }[] = [
  { role: 'Farmer', icon: User, label: 'Farmer' },
  { role: 'Lab', icon: TestTube, label: 'Lab' },
  { role: 'Manufacturer', icon: Factory, label: 'Manufacturer' },
  { role: 'Regulator', icon: Shield, label: 'Regulator' },
];

export function AppSidebar() {
  const { role, setRole } = useDashboard();
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
            <Bot className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-sidebar-foreground">Sanrakshak</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                onClick={() => setRole(item.role)}
                isActive={role === item.role}
                className={cn(
                  'gap-3 justify-start',
                   role === item.role && 'bg-primary/10 text-primary font-semibold'
                )}
                tooltip={item.label}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
