'use client';

import { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { useAppDispatch, useAppSelector } from '@/shared/store';
import { fetchJugadas, clearError } from '@/shared/store/slices/jugadasSlice';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RoleOnly } from '@/components/auth/RoleOnly';
import { CreateJugadaDialog } from './components/CreateJugadaDialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Jugada } from '@/shared/api/schemas';
import { EstadoJugada, Role } from '@/shared/api/types';
import { Plus, Search, Ban, Calendar } from 'lucide-react';

export default function JugadasPage() {
  const dispatch = useAppDispatch();
  const { list: jugadas, meta, status, error } = useAppSelector((state) => state.jugadas);
  
  const [filters, setFilters] = useState({
    fecha_desde: '',
    fecha_hasta: '',
    estado: '',
    numero: '',
    page: 1,
    limit: 20,
  });
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    const params: any = {
      page: filters.page,
      limit: filters.limit,
    };

    if (filters.fecha_desde) params.fecha_desde = filters.fecha_desde;
    if (filters.fecha_hasta) params.fecha_hasta = filters.fecha_hasta;
    if (filters.estado) params.estado = filters.estado;
    if (filters.numero) params.numero = parseInt(filters.numero, 10);

    dispatch(fetchJugadas(params));
  }, [dispatch, filters]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const columns: ColumnDef<Jugada>[] = [
    {
      accessorKey: 'fecha_hora',
      header: 'Fecha y Hora',
      cell: ({ row }) => {
        const date = new Date(row.getValue('fecha_hora'));
        return (
          <div>
            <p className="font-medium">{date.toLocaleDateString('es-DO')}</p>
            <p className="text-sm text-muted-foreground">
              {date.toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: 'numeros',
      header: 'Números',
      cell: ({ row }) => {
        const numeros = row.getValue('numeros') as number[];
        return (
          <div className="flex gap-1 flex-wrap">
            {numeros.map((numero, index) => (
              <Badge key={index} variant="outline" className="min-w-[32px] justify-center">
                {numero.toString().padStart(2, '0')}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: 'monto',
      header: 'Monto',
      cell: ({ row }) => (
        <p className="font-medium">${row.getValue<number>('monto').toLocaleString()}</p>
      ),
    },
    {
      accessorKey: 'premio',
      header: 'Premio',
      cell: ({ row }) => {
        const premio = row.getValue<number>('premio');
        return (
          <p className={`font-medium ${premio > 0 ? 'text-green-600' : ''}`}>
            ${premio.toLocaleString()}
          </p>
        );
      },
    },
    {
      accessorKey: 'estado',
      header: 'Estado',
      cell: ({ row }) => {
        const estado = row.getValue('estado') as EstadoJugada;
        return (
          <Badge 
            variant={estado === EstadoJugada.VALIDA ? 'default' : 'destructive'}
            className={estado === EstadoJugada.VALIDA ? 'bg-green-100 text-green-800' : ''}
          >
            {estado}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'banca_id',
      header: 'Banca',
      cell: ({ row }) => (
        <p className="text-sm text-muted-foreground">
          {row.getValue<string>('banca_id').slice(0, 8)}...
        </p>
      ),
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const estado = row.original.estado;
        return (
          <div className="flex items-center gap-2">
            <RoleOnly roles={[Role.ADMIN, Role.SUPERVISOR]}>
              {estado === EstadoJugada.VALIDA && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" disabled>
                        <Ban className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Anular jugada - Pendiente en backend</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </RoleOnly>
          </div>
        );
      },
    },
  ];

  // Establecer fechas por defecto (hoy)
  useEffect(() => {
    if (!filters.fecha_desde && !filters.fecha_hasta) {
      const today = new Date().toISOString().split('T')[0];
      setFilters(prev => ({
        ...prev,
        fecha_desde: today,
        fecha_hasta: today,
      }));
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Jugadas</h1>
          <p className="text-muted-foreground">
            Gestión de jugadas y apuestas
          </p>
        </div>
        <RoleOnly roles={[Role.ADMIN, Role.SUPERVISOR, Role.OPERADOR]}>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Jugada
          </Button>
        </RoleOnly>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Fecha Desde</label>
              <Input
                type="date"
                value={filters.fecha_desde}
                onChange={(e) => setFilters(prev => ({ ...prev, fecha_desde: e.target.value, page: 1 }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Fecha Hasta</label>
              <Input
                type="date"
                value={filters.fecha_hasta}
                onChange={(e) => setFilters(prev => ({ ...prev, fecha_hasta: e.target.value, page: 1 }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Estado</label>
              <Select
                value={filters.estado}
                onValueChange={(value) => setFilters(prev => ({ ...prev, estado: value, page: 1 }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="valida">Válida</SelectItem>
                  <SelectItem value="anulada">Anulada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Número</label>
              <Input
                type="number"
                min="0"
                max="99"
                placeholder="00-99"
                value={filters.numero}
                onChange={(e) => setFilters(prev => ({ ...prev, numero: e.target.value, page: 1 }))}
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={() => setFilters(prev => ({ 
                  ...prev, 
                  fecha_desde: '', 
                  fecha_hasta: '', 
                  estado: '', 
                  numero: '', 
                  page: 1 
                }))}
                variant="outline"
                className="w-full"
              >
                Limpiar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <DataTable
        columns={columns}
        data={jugadas}
        loading={status === 'loading'}
        meta={meta}
        onPageChange={handlePageChange}
      />

      <CreateJugadaDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
}