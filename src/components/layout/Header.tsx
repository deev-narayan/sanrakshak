'use client';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { UserRoleSwitcher } from '@/components/dashboard/UserRoleSwitcher';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
      <SidebarTrigger className="flex md:hidden" />
      <div className="flex-1">
        {/* Can add breadcrumbs or page title here */}
      </div>
      <UserRoleSwitcher />
    </header>
  );
}
