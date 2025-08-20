'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/shared/store';
import { fetchMe } from '@/shared/store/slices/authSlice';
import { Role } from '@/shared/api/types';
import { Skeleton } from '@/components/ui/skeleton';

interface AuthGuardProps {
  children: React.ReactNode;
  roles?: Role[];
}

export function AuthGuard({ children, roles }: AuthGuardProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, token, status } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    if (!user && token) {
      dispatch(fetchMe());
    }
  }, [token, user, dispatch, router]);

  useEffect(() => {
    if (user && roles && !roles.includes(user.rol)) {
      router.push('/dashboard');
    }
  }, [user, roles, router]);

  if (status === 'loading' || (token && !user)) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
    );
  }

  if (!token || !user) {
    return null;
  }

  if (roles && !roles.includes(user.rol)) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Acceso Denegado</h1>
          <p className="text-gray-600 mt-2">No tienes permisos para acceder a esta página</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}