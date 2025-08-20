'use client';

import { useAppSelector } from '@/shared/store';
import { Role } from '@/shared/api/types';

interface RoleOnlyProps {
  roles: Role[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleOnly({ roles, children, fallback = null }: RoleOnlyProps) {
  const user = useAppSelector((state) => state.auth.user);

  if (!user || !roles.includes(user.rol)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}