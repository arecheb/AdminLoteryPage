'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/shared/store';
import { Role } from '@/shared/api/types';
import { Button } from '@/components/ui/button';
import { RoleOnly } from '@/components/auth/RoleOnly';
import {
  LayoutDashboard,
  Building,
  Users,
  Gamepad2,
  Trophy,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: [Role.ADMIN, Role.SUPERVISOR, Role.OPERADOR],
  },
  {
    name: 'Bancas',
    href: '/bancas',
    icon: Building,
    roles: [Role.ADMIN, Role.SUPERVISOR],
  },
  {
    name: 'Vendedores',
    href: '/vendedores',
    icon: Users,
    roles: [Role.ADMIN, Role.SUPERVISOR],
  },
  {
    name: 'Jugadas',
    href: '/jugadas',
    icon: Gamepad2,
    roles: [Role.ADMIN, Role.SUPERVISOR, Role.OPERADOR],
  },
  {
    name: 'Sorteos',
    href: '/sorteos',
    icon: Trophy,
    roles: [Role.ADMIN, Role.SUPERVISOR],
  },
  {
    name: 'Reportes',
    href: '/reportes',
    icon: BarChart3,
    roles: [Role.ADMIN, Role.SUPERVISOR],
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const user = useAppSelector((state) => state.auth.user);

  if (!user) return null;

  return (
    <div className={cn(
      'bg-white border-r border-gray-200 flex flex-col transition-all duration-300',
      collapsed ? 'w-16' : 'w-64'
    )}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <h1 className="text-xl font-bold text-gray-900">
              {process.env.NEXT_PUBLIC_APP_NAME}
            </h1>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => (
          <RoleOnly key={item.name} roles={item.roles}>
            <Link
              href={item.href}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                pathname === item.href
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
                collapsed && 'justify-center'
              )}
            >
              <item.icon className={cn('h-5 w-5', !collapsed && 'mr-3')} />
              {!collapsed && item.name}
            </Link>
          </RoleOnly>
        ))}
      </nav>

      {!collapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            <p className="font-medium">{user.nombre}</p>
            <p className="capitalize">{user.rol}</p>
          </div>
        </div>
      )}
    </div>
  );
}