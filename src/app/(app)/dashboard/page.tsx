'use client';

import { useEffect, useState } from 'react';
import { KpiCard } from '@/components/ui/kpi-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  Gamepad2, 
  TrendingUp, 
  Building,
  Users,
  Trophy 
} from 'lucide-react';

// Mock data - En producción esto vendría de endpoints de reportes
const mockKpis = {
  totalVentas: 125000,
  jugadasRegistradas: 1453,
  gananciasNetas: 35600,
  bancasActivas: 28,
};

const mockRanking = [
  { id: 1, nombre: 'Banca Central', ventas: 25000, jugadas: 342 },
  { id: 2, nombre: 'Banca Norte', ventas: 18500, jugadas: 285 },
  { id: 3, nombre: 'Banca Sur', ventas: 16200, jugadas: 234 },
  { id: 4, nombre: 'Banca Este', ventas: 14800, jugadas: 198 },
  { id: 5, nombre: 'Banca Oeste', ventas: 12900, jugadas: 167 },
];

const mockResultados = [
  { sorteo: 'Leidsa', fecha: '2024-01-15', numeros: [23, 45, 67, 89], hora: '12:00 PM' },
  { sorteo: 'Nacional', fecha: '2024-01-15', numeros: [12, 34, 56, 78], hora: '10:00 AM' },
  { sorteo: 'Real', fecha: '2024-01-14', numeros: [11, 22, 33, 44], hora: '06:00 PM' },
];

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Vista general de las operaciones del día
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-96 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Vista general de las operaciones del día
        </p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Ventas del Día"
          value={`$${mockKpis.totalVentas.toLocaleString()}`}
          description="Total vendido hoy"
          icon={DollarSign}
          trend={{ value: 12.5, isPositive: true }}
        />
        <KpiCard
          title="Jugadas Registradas"
          value={mockKpis.jugadasRegistradas.toLocaleString()}
          description="Jugadas procesadas"
          icon={Gamepad2}
          trend={{ value: 8.2, isPositive: true }}
        />
        <KpiCard
          title="Ganancias Netas"
          value={`$${mockKpis.gananciasNetas.toLocaleString()}`}
          description="Ganancia después de premios"
          icon={TrendingUp}
          trend={{ value: 15.3, isPositive: true }}
        />
        <KpiCard
          title="Bancas Activas"
          value={mockKpis.bancasActivas}
          description="Bancas operativas"
          icon={Building}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Ranking de Bancas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Ranking de Bancas
            </CardTitle>
            <CardDescription>
              Top bancas por ventas del día
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRanking.map((banca, index) => (
                <div key={banca.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="w-8 h-8 rounded-full p-0 flex items-center justify-center">
                      {index + 1}
                    </Badge>
                    <div>
                      <p className="font-medium">{banca.nombre}</p>
                      <p className="text-sm text-muted-foreground">
                        {banca.jugadas} jugadas
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${banca.ventas.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Últimos Resultados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Últimos Resultados
            </CardTitle>
            <CardDescription>
              Resultados recientes de sorteos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockResultados.map((resultado, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{resultado.sorteo}</p>
                    <p className="text-sm text-muted-foreground">
                      {resultado.fecha} - {resultado.hora}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {resultado.numeros.map((numero, i) => (
                      <Badge key={i} variant="secondary" className="min-w-[32px] justify-center">
                        {numero.toString().padStart(2, '0')}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}