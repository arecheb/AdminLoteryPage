'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RoleOnly } from '@/components/auth/RoleOnly';
import { Role } from '@/shared/api/types';
import { Download, BarChart3 } from 'lucide-react';

export default function ReportesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reportes</h1>
          <p className="text-muted-foreground">
            Reportes y análisis de ventas
          </p>
        </div>
        <RoleOnly roles={[Role.ADMIN, Role.SUPERVISOR]}>
          <Button disabled>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </RoleOnly>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Módulo en Desarrollo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">Reportes y Estadísticas</h3>
            <p className="mt-1 text-sm text-gray-500">
              Este módulo requiere endpoints de reportes no disponibles en el backend actual.
            </p>
            <div className="mt-6">
              <p className="text-sm text-gray-500">Funcionalidades planificadas:</p>
              <ul className="mt-2 text-sm text-gray-500 list-disc list-inside space-y-1">
                <li>Reporte de ventas por día, banca y vendedor</li>
                <li>Reporte de premios ganados</li>
                <li>Estadísticas de rendimiento</li>
                <li>Exportación a PDF y Excel</li>
                <li>Gráficas y dashboards avanzados</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}