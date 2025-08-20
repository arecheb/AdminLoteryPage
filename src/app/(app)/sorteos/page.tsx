'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RoleOnly } from '@/components/auth/RoleOnly';
import { Role } from '@/shared/api/types';
import { Plus, Trophy } from 'lucide-react';

export default function SorteosPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sorteos</h1>
          <p className="text-muted-foreground">
            Gestión de sorteos y resultados
          </p>
        </div>
        <RoleOnly roles={[Role.ADMIN, Role.SUPERVISOR]}>
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Sorteo
          </Button>
        </RoleOnly>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Módulo en Desarrollo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Trophy className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">Sorteos y Resultados</h3>
            <p className="mt-1 text-sm text-gray-500">
              Este módulo requiere endpoints adicionales no disponibles en el backend actual.
            </p>
            <div className="mt-6">
              <p className="text-sm text-gray-500">Funcionalidades planificadas:</p>
              <ul className="mt-2 text-sm text-gray-500 list-disc list-inside space-y-1">
                <li>Catálogo de sorteos (Nacional, Leidsa, Real)</li>
                <li>Ingreso manual y automático de resultados</li>
                <li>Publicación de resultados</li>
                <li>Horarios y configuración</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}